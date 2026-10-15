<template>
  <div class="user-management">
    <h1>User Management</h1>
    <p v-if="loading" class="empty">Loading users...</p>
    <p v-else-if="nonAdminUsers.length === 0" class="empty">No registered users yet.</p>
    <ul v-else class="user_list">
      <li
        v-for="user in nonAdminUsers"
        :key="user.id"
        class="user_row"
        :class="{ blocked: user.blocked }"
      >
        <div class="user_info">
          <span class="user_name">{{ user.username }}</span>
          <span class="user_email">{{ user.email }}</span>
        </div>
        <span v-if="user.blocked" class="status">Blocked</span>
        <button type="button" @click="toggleBlockUser(user)">
          {{ user.blocked ? "Unblock" : "Block" }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import UserService from "../services/UserService";
import { toast } from "../services/toast";

export default {
  name: "UserManagement",
  data() {
    return {
      users: [], // Raw list of users
      loading: true,
    };
  },
  computed: {
    // Filter out admin users
    nonAdminUsers() {
      return this.users.filter((user) => {
        // Roles come from the API as objects: [{ name: "admin" }]
        return !(user.roles || []).some((role) => role.name === "admin");
      });
    },
  },
  methods: {
    // Fetch users from the backend
    async fetchUsers() {
      try {
        this.users = await UserService.getAllUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load users.");
      } finally {
        this.loading = false;
      }
    },
    // Toggle the blocked state of a user
    async toggleBlockUser(user) {
      try {
        if (user.blocked) {
          await UserService.unblockUser(user.id); // Unblock user
        } else {
          await UserService.blockUser(user.id); // Block user
        }
        user.blocked = !user.blocked; // Update the blocked state locally
        toast.success(`${user.username} has been ${user.blocked ? "blocked" : "unblocked"}.`);
      } catch (error) {
        toast.error(error.response?.data?.message || `Could not ${user.blocked ? "unblock" : "block"} ${user.username}.`);
      }
    },
  },
  mounted() {
    this.fetchUsers(); // Fetch users on component mount
  },
};
</script>

<style scoped>
.user-management {
  width: calc(100% - 32px);
  max-width: 800px;
  margin: 30px auto;
}

.user-management h1 {
  color: #243e36;
  text-align: center;
  margin-bottom: 20px;
}

.empty {
  text-align: center;
  color: #555;
}

.user_list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user_row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background-color: #f0e9d7;
  border-radius: 12px;
}

.user_row.blocked {
  background-color: #e4e4e4;
}

.user_info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.user_name {
  font-weight: bold;
  color: #243e36;
  overflow-wrap: anywhere;
}

.user_email {
  font-size: 0.9rem;
  color: #555;
  overflow-wrap: anywhere;
}

.status {
  font-size: 0.8rem;
  font-weight: bold;
  color: #7a1a14;
  background-color: #f6d9d6;
  padding: 4px 10px;
  border-radius: 10px;
}

.user_row button {
  flex-shrink: 0;
  min-width: 90px;
  padding: 8px 16px;
  border: 1px solid #243e36;
  border-radius: 20px;
  background-color: #243e36;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
}

.user_row button:hover {
  background-color: white;
  color: #243e36;
}

@media (max-width: 500px) {
  .user_row {
    flex-wrap: wrap;
  }

  .user_info {
    flex-basis: 100%;
  }

  .user_row button {
    margin-left: auto;
  }
}
</style>
