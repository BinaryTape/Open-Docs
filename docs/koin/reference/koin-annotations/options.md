---
title: KSP 编译器选项
---

Koin Annotations KSP 处理器支持多种配置选项，这些选项可以在编译期间传递，以自定义代码生成行为。

## 可用选项

### KOIN_CONFIG_CHECK
- **类型**: Boolean
- **默认值**: `false`
- **描述**: 启用 Koin 定义的编译期配置检测。启用后，编译器将在编译期验证所有 Koin 配置，以确保安全并尽早发现潜在问题。
- **用法**: 通过在运行时之前检测配置问题，有助于提高编译期安全性。

### KOIN_LOG_TIMES
- **类型**: Boolean
- **默认值**: `false`
- **描述**: 在编译期间显示模块生成的时间日志。这有助于监控代码生成性能并识别潜在瓶颈。
- **用法**: 对于调试和优化构建时间很有用。

### KOIN_DEFAULT_MODULE
- **类型**: Boolean
- **默认值**: `false`
- **状态**: ⚠️ **自 1.3.0 起弃用**
- **描述**: 如果给定定义没有找到显式模块，则自动生成一个默认模块。**此选项自 Annotations 1.3.0 起已弃用且不建议使用。** 取而代之，请使用 `@Configuration` 注解和 `@KoinApplication` 来自动引导您的应用程序。
- **用法**: 避免使用此选项。为提高代码清晰度和可维护性，请优先使用 `@Configuration` 和 `@KoinApplication` 进行显式模块组织。

### KOIN_GENERATION_PACKAGE
- **类型**: String
- **默认值**: `"org.koin.ksp.generated"`
- **描述**: 指定生成 Koin 类将放置的包名。包名必须是有效的 Kotlin 包标识符。**重要提示**: 如果设置了此选项，则必须在所有模块中一致使用相同的值。
- **用法**: 仅当您的项目需要将代码生成到与默认路径不同的位置时（例如，由于特定的编码规则或项目结构要求）才使用此选项。确保所有模块使用相同的包名。

### KOIN_USE_COMPOSE_VIEWMODEL
- **类型**: Boolean
- **默认值**: `true`
- **描述**: 使用 `koin-core-viewmodel` 主 DSL 生成 ViewModel 定义，而不是 Android 特有的 ViewModel。此选项默认启用，以提供 Kotlin Multiplatform 兼容性并使用统一的 ViewModel API。
- **用法**: 建议所有项目保持启用。对于需要在跨平台支持 ViewModel 的 KMP 项目至关重要。

### KOIN_EXPORT_DEFINITIONS
- **类型**: Boolean
- **默认值**: `true`
- **描述**: 控制除了模块组装的定义外，是否还生成导出的定义。禁用后，将只生成在模块中组装的定义，并过滤掉独立的导出定义。
- **用法**: 如果您只想生成在模块中显式组装的定义，并排除独立的导出定义，请将其设置为 `false`。有助于实现更严格的模块组织。

## 配置示例

### Gradle Kotlin DSL

```kotlin
ksp {
    arg("KOIN_CONFIG_CHECK", "true")
    arg("KOIN_LOG_TIMES", "true")
    arg("KOIN_DEFAULT_MODULE", "false")
    arg("KOIN_GENERATION_PACKAGE", "com.mycompany.koin.generated")
    arg("KOIN_USE_COMPOSE_VIEWMODEL", "true")
    arg("KOIN_EXPORT_DEFINITIONS", "true")
}
```

### Gradle Groovy DSL

```groovy
ksp {
    arg("KOIN_CONFIG_CHECK", "true")
    arg("KOIN_LOG_TIMES", "true")
    arg("KOIN_DEFAULT_MODULE", "false")
    arg("KOIN_GENERATION_PACKAGE", "com.mycompany.koin.generated")
    arg("KOIN_USE_COMPOSE_VIEWMODEL", "true")
    arg("KOIN_EXPORT_DEFINITIONS", "true")
}
```

## 最佳实践

- **在开发构建中启用 KOIN_CONFIG_CHECK**，以尽早发现配置问题
- **在构建优化期间使用 KOIN_LOG_TIMES**，以识别性能瓶颈
- **仅在编码规则合规性必要时使用 KOIN_GENERATION_PACKAGE** —— 确保在所有模块中一致使用
- **保持 KOIN_USE_COMPOSE_VIEWMODEL 启用（默认）**，以实现跨平台的统一 ViewModel API
- **避免使用 KOIN_DEFAULT_MODULE** —— 使用 `@Configuration` 和 `@KoinApplication` 进行正确的应用程序引导

## 包名验证

使用 `KOIN_GENERATION_PACKAGE` 时，提供的包名必须满足以下条件：
- 非空
- 仅包含由点分隔的有效 Kotlin 标识符
- 不使用 Kotlin 关键字或保留字
- 遵循标准的 Java/Kotlin 包命名约定

无效的包名将导致编译错误并显示描述性消息。