
import { signIn } from 'next-auth/react';

// This would normally be called from the client-side login form
async function testLogin() {
  try {
    console.log('🔄 Testing login with demo credentials...');
    
    // This simulates what happens when the login form is submitted
    const result = await signIn('credentials', {
      email: 'john@doe.com',
      password: 'johndoe123',
      redirect: false,
    });

    if (result?.error) {
      console.log('❌ Login failed:', result.error);
    } else {
      console.log('✅ Login successful!');
      console.log('- Session created');
      console.log('- User authenticated');
    }
    
    return result;
  } catch (error) {
    console.error('❌ Login test error:', error);
  }
}

testLogin();
