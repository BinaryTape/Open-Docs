---
title: 编译器插件选项
---

Koin 编译器插件支持配置选项，用于自定义其行为。

## 配置

在您的 `build.gradle.kts` 中配置编译器插件：

```kotlin
koinCompiler {
    userLogs = true
    debugLogs = false
    dslSafetyChecks = true
}
```

## 可用选项

### userLogs

- **类型**：Boolean
- **默认值**：`false`
- **说明**：启用组件检测和 DSL/注解处理的日志。显示插件发现并处理了哪些组件。
- **用法**：在开发期间启用，以调试组件发现问题。

```kotlin
koinCompiler {
    userLogs = true
}
```

### debugLogs

- **类型**：Boolean
- **默认值**：`false`
- **说明**：启用内部插件处理（FIR/IR 阶段、模块发现）的详细调试日志。
- **用法**：在对插件问题进行故障排除或报告错误时启用。

```kotlin
koinCompiler {
    debugLogs = true
}
```

### dslSafetyChecks

- **类型**：Boolean
- **默认值**：`true`
- **说明**：验证 lambda表达式 内部的 DSL 函数调用（如 `create()`）是否为唯一指令。有助于防止常见错误。
- **用法**：如有需要，可在从经典 DSL 迁移期间暂时禁用。

```kotlin
koinCompiler {
    dslSafetyChecks = false  // 迁移期间禁用
}
```

## 完整示例

```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

koinCompiler {
    userLogs = true        // 记录组件检测
    debugLogs = false      // 详细日志（默认关闭）
    dslSafetyChecks = true // 验证 DSL 用法
}
```

## 最佳做法

- 在开发期间 **启用 `userLogs`** 以查看检测到哪些组件
- **保持 `dslSafetyChecks` 处于启用状态**（默认），以获得更安全的 DSL 用法
- **仅在故障排除插件问题时使用 `debugLogs`**

## 另请参阅

- **[编译器插件设置](/docs/setup/compiler-plugin)** – 完整设置指南
- **[从注解开始](/docs/reference/koin-annotations/start)** – 入门指南