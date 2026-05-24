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
    compileSafety = true
    strictSafety = true       // 默认自动检测
    skipDefaultValues = true
    unsafeDslChecks = true
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

### compileSafety

- **类型**：Boolean
- **默认值**：`true`
- **说明**：启用编译时依赖项验证。启用后，插件将验证所有依赖项是否能在构建时解析——在运行时之前捕获缺失定义、限定符不匹配和损坏的调用站点。
- **用法**：默认启用。如果需要在迁移期间绕过验证，请暂时禁用。

```kotlin
koinCompiler {
    compileSafety = true
}
```

有关验证内容的完整详细信息，请参阅[编译时安全](/docs/reference/koin-compiler/compile-safety)。

### strictSafety

- **类型**：Boolean
- **默认值**：自动检测（在聚合模块上启用——即包含 `startKoin`、`koinApplication` 或 `@KoinApplication` 的模块）
- **说明**：强制在每次构建时重新运行全图安全检查 (A3)，绕过聚合模块上的 Kotlin 增量编译缓存。库模块和功能模块仍保持完全增量。
- **用法**：保持默认设置。如果自动检测漏掉了您的聚合器，请显式设置为 `true`；或者设置为 `false` 以退出（例如，当测试固定例程仅在注释中引用了 `startKoin` 并误触发检测器时）。

```kotlin
koinCompiler {
    strictSafety = true   // 强制启用
    // 或
    strictSafety = false  // 退出自动检测
}
```

**存在原因**：目前的 K2 增量编译（通过 AGP 使用的 Build Tools API）不跟踪 DI 图依赖的两件事——`module { … }` lambda表达式体内的 DSL 定义（不属于任何声明的 ABI），以及 `@ComponentScan` 软件包范围发现（扫描器与新添加的类之间没有源码级的关联）。即使图已更改，聚合器的 `compileKotlin` 任务也可能被标记为 `UP-TO-DATE`。`strictSafety` 是在目前 K2 增量编译暴露出的问题之上，成本最小且正确的权宜措施；由于每次构建仅重新运行聚合器，因此其成本是有限的。

当 `compileSafety = false` 时无效。背景请参阅 [koin-compiler-plugin 问题 #32](https://github.com/InsertKoinIO/koin-compiler-plugin/issues/32)。

### skipDefaultValues

- **类型**：Boolean
- **默认值**：`true`
- **说明**：启用后，具有 Kotlin 默认值的形参将使用默认值，而不是从 DI 容器中解析。可为 null 的形参和带注解的形参（`@Named`、`@InjectedParam` 等）仍会正常解析。
- **用法**：默认启用。禁用此项可始终从 DI 容器注入所有形参。

```kotlin
koinCompiler {
    skipDefaultValues = true
}
```

### unsafeDslChecks

- **类型**：Boolean
- **默认值**：`true`
- **说明**：验证 lambda表达式内部的 DSL 函数调用（如 `create()`）是否为唯一指令。有助于防止常见错误。
- **用法**：如有需要，可在从经典 DSL 迁移期间暂时禁用。

```kotlin
koinCompiler {
    unsafeDslChecks = false  // 迁移期间禁用
}
```

## 完整示例

```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

koinCompiler {
    userLogs = true           // 记录组件检测
    debugLogs = false         // 详细日志（默认关闭）
    compileSafety = true      // 编译时依赖项验证
    strictSafety = true       // 强制聚合器重新运行安全检查（默认自动检测）
    skipDefaultValues = true  // 使用 Kotlin 默认值而非 DI 解析
    unsafeDslChecks = true    // 验证 DSL 用法
}
```

## 最佳做法

- **保持 `compileSafety` 处于启用状态**（默认），以进行编译时依赖项验证
- **让 `strictSafety` 保持自动检测**——仅在检测器漏掉聚合器或在非聚合器文件上误报时才进行覆盖
- **保持 `skipDefaultValues` 处于启用状态**（默认），以遵循 Kotlin 默认值
- **在开发期间启用 `userLogs`**，以查看检测到哪些组件
- **保持 `unsafeDslChecks` 处于启用状态**（默认），以获得更安全的 DSL 用法
- **仅在对插件问题进行故障排除时使用 `debugLogs`**

## 另请参阅

- **[编译时安全](/docs/reference/koin-compiler/compile-safety)** - 验证内容及方式
- **[编译器插件设置](/docs/setup/compiler-plugin)** - 完整设置指南
- **[从注解开始](/docs/reference/koin-annotations/start)** - 入门指南