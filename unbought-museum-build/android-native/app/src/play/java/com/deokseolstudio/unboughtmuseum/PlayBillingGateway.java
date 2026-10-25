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
