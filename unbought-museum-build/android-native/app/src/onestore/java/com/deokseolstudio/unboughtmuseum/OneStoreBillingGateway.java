package com.deokseolstudio.unboughtmuseum;

import android.app.Activity;
import com.gaa.sdk.iap.IapResult;
import com.gaa.sdk.iap.PurchaseClient;
import com.gaa.sdk.iap.PurchaseClientStateListener;
import com.gaa.sdk.iap.PurchaseData;
import com.gaa.sdk.iap.PurchaseFlowParams;
import com.gaa.sdk.iap.PurchasesUpdatedListener;
import java.util.List;

/**
 * ONE store IAP v21 transport for managed purchases.
 * Every token remains unverified until a trusted backend verifies the store
 * transaction and its refund state. Never grant premium locally.
 * Do not attach this class to the purchase UI until a registered product and
 * verified fulfillment endpoint are available.
 */
public final class OneStoreBillingGateway {
    public interface ReceiptSink {
        void onUnverifiedPurchase(PurchaseData purchase);
        void onStoreError(int responseCode);
    }

    private final PurchaseClient client;
    private final ReceiptSink sink;
    private boolean connected;

    public OneStoreBillingGateway(Activity activity, ReceiptSink receiptSink) {
        sink = receiptSink;
        client = PurchaseClient.newBuilder(activity)
            .setListener(new PurchasesUpdatedListener() {
                @Override public void onPurchasesUpdated(IapResult result, List<PurchaseData> purchases) {
                    if (!result.isSuccess()) {
                        sink.onStoreError(result.getResponseCode());
                        return;
                    }
                    forwardUnverified(purchases);
                }
            }).build();
    }

    public void connect() {
        client.startConnection(new PurchaseClientStateListener() {
            @Override public void onSetupFinished(IapResult result) {
                connected = result.isSuccess();
                if (!connected) sink.onStoreError(result.getResponseCode());
            }
            @Override public void onServiceDisconnected() {
                connected = false;
            }
        });
    }

    /**
     * Starts a store-owned payment sheet after an explicit user click.
     * This remains disabled until the real store product and trusted
     * server receipt verification are available.
     */
    public void startOneTimeCheckout(Activity activity, String registeredProductId,
                                      boolean serverVerificationReady) {
        if (!serverVerificationReady || registeredProductId == null ||
            !registeredProductId.matches("[a-z0-9_]{3,100}")) {
            sink.onStoreError(-1);
            return;
        }
        if (!connected || !client.isReady()) {
            sink.onStoreError(-1);
            return;
        }
        PurchaseFlowParams params = PurchaseFlowParams.newBuilder()
            .setProductId(registeredProductId)
            .setProductType(PurchaseClient.ProductType.INAPP)
            .build();
        activity.runOnUiThread(() -> {
            IapResult result = client.launchPurchaseFlow(activity, params);
            if (!result.isSuccess()) sink.onStoreError(result.getResponseCode());
        });
    }

    public void queryUnverifiedPurchases() {
        if (!connected || !client.isReady()) {
            sink.onStoreError(-1);
            return;
        }
        client.queryPurchasesAsync(PurchaseClient.ProductType.INAPP, (result, purchases) -> {
            if (!result.isSuccess()) {
                sink.onStoreError(result.getResponseCode());
                return;
            }
            forwardUnverified(purchases);
        });
    }

    private void forwardUnverified(List<PurchaseData> purchases) {
        if (purchases == null) return;
        for (PurchaseData purchase : purchases) sink.onUnverifiedPurchase(purchase);
    }

    public void close() {
        connected = false;
        client.endConnection();
    }
}
