import { system } from "../enums";
export default {
  path: "/system",
  meta: {
    icon: "ri:settings-3-line",
    title: "系统管理",
    rank: system
  },
  children: [
    {
      path: "/system/user/index",
      name: "SystemUser",
      component: () => import("@/views/system/user/index.vue"),
      meta: {
        icon: "ri:admin-line",
        title: "用户管理"
        // roles: ["admin"]
      }
    },
    {
      path: "/system/role/index",
      name: "SystemRole",
      component: () => import("@/views/system/role/index.vue"),
      meta: {
        icon: "ri:admin-fill",
        title: "角色管理"
        // roles: ["admin"]
      }
    },
    {
      path: "/system/menu/index",
      name: "SystemMenu",
      component: () => import("@/views/system/menu/index.vue"),
      meta: {
        icon: "ep:menu",
        title: "菜单管理"
        // roles: ["admin"]
      }
    },
    {
      path: "/system/dept/index",
      name: "SystemDept",
      component: () => import("@/views/system/dept/index.vue"),
      meta: {
        icon: "ri:git-branch-line",
        title: "部门管理"
        // roles: ["admin"]
      }
    }
  ]
} satisfies RouteConfigsTable;
