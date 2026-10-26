package com.deokseolstudio.unboughtmuseum;
import android.app.Activity;
import com.android.billingclient.api.*;
import java.util.List;
/** Play Billing transport. Only the verified backend can grant entitlements. */
public final class PlayBillingGateway implements PurchasesUpdatedListener {
  public interface ReceiptSink {
    void onUnverifiedPurchase(String product, String token, int state);
    void onBillingError(int code);
  }
  private final BillingClient client;
  private final ReceiptSink sink;
  private boolean connected;
  public PlayBillingGateway(Activity activity, ReceiptSink sink) {
    this.sink=sink;
    client=BillingClient.newBuilder(activity).setListener(this)
      .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
      .enableAutoServiceReconnection().build();
  }
  public void connect() {
    client.startConnection(new BillingClientStateListener(){
      @Override public void onBillingSetupFinished(BillingResult result){
        connected=result.getResponseCode()==BillingClient.BillingResponseCode.OK;
        if(!connected)sink.onBillingError(result.getResponseCode());
      }
      @Override public void onBillingServiceDisconnected(){connected=false;}
    });
  }
  /**
   * Initiates the official purchase sheet only after the caller has supplied
   * a real registered SKU and confirmed server-side fulfillment is available.
   * Never grants premium; all resulting tokens must be verified on a server.
   * The call must originate from an explicit user action.
   */
  public void startOneTimeCheckout(Activity activity, String registeredProductId,
                                   boolean serverVerificationReady) {
    if (!serverVerificationReady || registeredProductId == null ||
        !"museum_gallery_pass_v1".equals(registeredProductId)) {
      sink.onBillingError(BillingClient.BillingResponseCode.DEVELOPER_ERROR);
      return;
    }
    if (!connected || !client.isReady()) {
      sink.onBillingError(BillingClient.BillingResponseCode.SERVICE_DISCONNECTED);
      return;
    }
    QueryProductDetailsParams.Product product = QueryProductDetailsParams.Product.newBuilder()
        .setProductId(registeredProductId)
        .setProductType(BillingClient.ProductType.INAPP).build();
    QueryProductDetailsParams query = QueryProductDetailsParams.newBuilder()
        .setProductList(java.util.Collections.singletonList(product)).build();
    client.queryProductDetailsAsync(query, (result, detailsResult) -> {
      if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
        sink.onBillingError(result.getResponseCode()); return;
      }
      for (ProductDetails details : detailsResult.getProductDetailsList()) {
        if (!registeredProductId.equals(details.getProductId())) continue;
        List<ProductDetails.OneTimePurchaseOfferDetails> offers =
            details.getOneTimePurchaseOfferDetailsList();
        if (offers == null || offers.isEmpty()) break;
        BillingFlowParams.ProductDetailsParams params =
            BillingFlowParams.ProductDetailsParams.newBuilder()
            .setProductDetails(details).setOfferToken(offers.get(0).getOfferToken()).build();
        BillingFlowParams flow = BillingFlowParams.newBuilder()
            .setProductDetailsParamsList(java.util.Collections.singletonList(params)).build();
        activity.runOnUiThread(() -> {
          BillingResult launched = client.launchBillingFlow(activity, flow);
          if (launched.getResponseCode() != BillingClient.BillingResponseCode.OK)
            sink.onBillingError(launched.getResponseCode());
        });
        return;
      }
      sink.onBillingError(BillingClient.BillingResponseCode.ITEM_UNAVAILABLE);
    });
  }
  public void queryUnverifiedPurchases(){
    if(!connected || !client.isReady()){
      sink.onBillingError(BillingClient.BillingResponseCode.SERVICE_DISCONNECTED);return;
    }
    client.queryPurchasesAsync(QueryPurchasesParams.newBuilder()
      .setProductType(BillingClient.ProductType.INAPP).build(),(result,purchases)->{
        if(result.getResponseCode()!=BillingClient.BillingResponseCode.OK){
          sink.onBillingError(result.getResponseCode());return;
        }
        forward(purchases);
      });
  }
  @Override public void onPurchasesUpdated(BillingResult result,List<Purchase> purchases){
    if(result.getResponseCode()!=BillingClient.BillingResponseCode.OK){
      sink.onBillingError(result.getResponseCode());return;
    }
    forward(purchases);
  }
  private void forward(List<Purchase> purchases){
    if(purchases==null)return;
    for(Purchase purchase:purchases)for(String product:purchase.getProducts())
      sink.onUnverifiedPurchase(product,purchase.getPurchaseToken(),purchase.getPurchaseState());
  }
  public void close(){connected=false;client.endConnection();}
}
