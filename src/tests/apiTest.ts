import assert from 'assert';

const baseUrl = 'http://localhost:4000/api/users';

async function runTests() {
  let userId: string;

  try {
    //Test 1 GET all users
    const res1 = await fetch(baseUrl);
    const dataUsers = await res1.json();
    assert.strictEqual(res1.status, 200);
    assert.ok(Array.isArray(dataUsers));
    console.log('Test 1 (GET all users) passed!');

    //Test 2 POST create user
    const newUser = { username: 'Ivan', age: 20, hobbies: ['sleap'] };
    const res2 = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    const createdUser = await res2.json();
    assert.strictEqual(res2.status, 201);
    assert.ok(createdUser.id);
    userId = createdUser.id;
    console.log('Test 2 (POST create user) passed!');

    //Test 3 GET user by ID
    const res3 = await fetch(`${baseUrl}/${userId}`);
    const dataUser = await res3.json();
    assert.strictEqual(res3.status, 200);
    assert.strictEqual(dataUser.username, 'Ivan');
    console.log('Test 3 (GET user by ID) passed!');

    //Test 4 PUT updated user by ID
    const updatedUser = { username: 'IvanUpdated', age: 20, hobbies: ['sleap', 'coding'] };
    const res4 = await fetch(`${baseUrl}/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser),
    });
    const updatedData = await res4.json();
    assert.strictEqual(res4.status, 200);
    assert.strictEqual(updatedData.username, 'IvanUpdated');
    assert.strictEqual(updatedData.id, userId);
    console.log('Test 4 (PUT updated user by ID) passed!');

    //Test 5 DELETE user by ID
    const res5 = await fetch(`${baseUrl}/${userId}`, { method: 'DELETE' });
    assert.strictEqual(res5.status, 204);
    console.log('Test 5 (DELETE user by ID) passed!');

    //Test 6 GET users after deletion
    const res6 = await fetch(`${baseUrl}/${userId}`);
    assert.strictEqual(res6.status, 404);
    console.log('Test 6 (GET after deletion) passed!');
  } catch (err) {
    console.error('Test failed:', err);
  }
}

runTests();
