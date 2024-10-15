import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  const shoppingList = document.getElementById('shopping-list');
  const itemInput = document.getElementById('item-input');
  const addItemButton = document.getElementById('add-item');

  async function refreshList() {
    const items = await backend.getItems();
    shoppingList.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.className = `shopping-item ${item.completed ? 'completed' : ''}`;
      li.innerHTML = `
        <button class="complete-btn"><i class="fas fa-check"></i></button>
        <span>${item.text}</span>
        <button class="delete-btn"><i class="fas fa-trash"></i></button>
      `;
      
      const completeBtn = li.querySelector('.complete-btn');
      completeBtn.addEventListener('click', async () => {
        await backend.toggleItem(item.id);
        await refreshList();
      });

      const deleteBtn = li.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', async () => {
        await backend.deleteItem(item.id);
        await refreshList();
      });

      shoppingList.appendChild(li);
    });
  }

  addItemButton.addEventListener('click', async () => {
    const text = itemInput.value.trim();
    if (text) {
      await backend.addItem(text);
      itemInput.value = '';
      await refreshList();
    }
  });

  itemInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter') {
      const text = itemInput.value.trim();
      if (text) {
        await backend.addItem(text);
        itemInput.value = '';
        await refreshList();
      }
    }
  });

  await refreshList();
});
