// DeliveryProof public surface smoke test — informational checks only.
// Never purchases, reads local client data, or changes third-party services.
const origin = "https://dlaepdfuf89-crypto.github.io";
const tests = [
  {path:"/deliveryproof/", expect:["DeliveryProof", "deliveryproof-free-evaluation", "deliveryproof-international", "direct-r4-download.html"]},
  {path:"/deliveryproof/ko.html", expect:["DeliveryProof", "₩49,000", "direct-r4-download.html"]},
  {path:"/deliveryproof/direct-r4-download.html", expect:["DeliveryProof_FREE_EVALUATION_5_PACKAGES_20261012_R4.zip", "five", "SHA-256"]},
  {path:"/deliveryproof/free-video-folder-compare.html", expect:['id="demo"', "deliveryproof-free-evaluation", "deliveryproof-international"]},
  {path:"/deliveryproof/batch-deliverables-matrix.html", expect:['id="run-demo-90"', 'id="expected-csv"', "deliveryproof-free-evaluation", "deliveryproof-international"]},
  {path:"/deliveryproof/check-fit.html", expect:["DeliveryProof", "direct-r4-download.html"]}
];
let failures=0;
for(const test of tests){
 const url=origin+test.path;
 try{
  const response=await fetch(url,{redirect:"follow",headers:{"User-Agent":"DeliveryProof-Public-QA/1.0"},signal:AbortSignal.timeout(20000)});
  const html=await response.text();
  const missing=test.expect.filter(x=>!html.includes(x));
  const pass=response.status===200&&missing.length===0;
  if(!pass)failures++;
  console.log(JSON.stringify({time:new Date().toISOString(),url,status:response.status,bytes:html.length,missing,pass}));
 }catch(error){
  failures++;
  console.error(JSON.stringify({time:new Date().toISOString(),url,pass:false,error:String(error)}));
 }
}
console.log("DeliveryProof public smoke:",tests.length-failures,"PASS",failures,"FAIL; paid checkout and real Windows execution NOT tested");
if(failures) process.exitCode=1;
