/**
 * Test webhook and message handler endpoints
 */

async function testEndpoints() {
  console.log("🧪 Testing SFG Aluminium Dashboard Endpoints...\n");
  
  const baseUrl = "https://sfg-unified-brain.abacusai.app";
  
  // Test 1: Webhook endpoint with test event
  console.log("1️⃣ Testing Webhook Endpoint...");
  try {
    const webhookResponse = await fetch(`${baseUrl}/api/webhooks/nexus`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "test.event",
        data: {
          test_id: "test-123",
          message: "Testing webhook endpoint",
        },
      }),
    });
    
    const webhookData = await webhookResponse.json();
    console.log(`   Status: ${webhookResponse.status}`);
    console.log(`   Response:`, JSON.stringify(webhookData, null, 2));
    console.log(`   ✓ Webhook endpoint is ${webhookResponse.ok ? "working" : "not responding"}\n`);
  } catch (error: any) {
    console.log(`   ✗ Webhook test failed: ${error.message}\n`);
  }
  
  // Test 2: Message handler endpoint with ping
  console.log("2️⃣ Testing Message Handler Endpoint...");
  try {
    const messageResponse = await fetch(`${baseUrl}/api/messages/handle`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "ping",
        params: {},
        request_id: "test-ping-123",
      }),
    });
    
    const messageData = await messageResponse.json();
    console.log(`   Status: ${messageResponse.status}`);
    console.log(`   Response:`, JSON.stringify(messageData, null, 2));
    console.log(`   ✓ Message handler is ${messageResponse.ok ? "working" : "not responding"}\n`);
  } catch (error: any) {
    console.log(`   ✗ Message handler test failed: ${error.message}\n`);
  }
  
  // Test 3: Message handler GET (health check)
  console.log("3️⃣ Testing Message Handler Health Check...");
  try {
    const healthResponse = await fetch(`${baseUrl}/api/messages/handle`, {
      method: "GET",
    });
    
    const healthData = await healthResponse.json();
    console.log(`   Status: ${healthResponse.status}`);
    console.log(`   Response:`, JSON.stringify(healthData, null, 2));
    console.log(`   ✓ Health check ${healthResponse.ok ? "passed" : "failed"}\n`);
  } catch (error: any) {
    console.log(`   ✗ Health check failed: ${error.message}\n`);
  }
  
  console.log("✅ Endpoint testing complete!\n");
  console.log("📝 Summary:");
  console.log(`   • Webhook URL: ${baseUrl}/api/webhooks/nexus`);
  console.log(`   • Message Handler URL: ${baseUrl}/api/messages/handle`);
}

testEndpoints();
