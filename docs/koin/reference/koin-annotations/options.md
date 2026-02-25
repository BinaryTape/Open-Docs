---
title: KSP 编译器选项
---

Koin Annotations KSP 处理器支持多个配置选项，这些选项可以在编译期间传递，用于自定义代码生成行为。

## 可用选项

### KOIN_CONFIG_CHECK
- **类型**：Boolean
- **默认值**：`false`
- **说明**：为 Koin 定义启用编译时配置检查。启用后，编译器将在编译时验证所有 Koin 配置，以确保安全性并尽早发现潜在问题。
- **用法**：通过在运行时之前检测配置问题，帮助提高编译时安全性。

### KOIN_LOG_TIMES
- **类型**：Boolean
- **默认值**：`false`
- **说明**：在编译期间显示模块生成的耗时日志。这有助于监控代码生成的性能并识别潜在瓶颈。
- **用法**：适用于调试和优化构建时间。

### KOIN_DEFAULT_MODULE
- **类型**：Boolean
- **默认值**：`false`
- **状态**：⚠️ **自 1.3.0 起弃用**
- **说明**：如果找不到给定定义的显式模块，则自动生成一个默认模块。**此选项自 Annotations 1.3.0 起已弃用，且不建议使用。**请改用 `@Configuration` 注解和 `@KoinApplication` 来自动引导您的应用程序。
- **用法**：避免使用此选项。首选使用 `@Configuration` 和 `@KoinApplication` 进行显式模块组织，以获得更好的代码清晰度和可维护性。

### KOIN_GENERATION_PACKAGE
- **类型**：String
- **默认值**：`"org.koin.ksp.generated"`
- **说明**：指定生成的 Koin 类所在的软件包名称。软件包名称必须是一个有效的 Kotlin 软件包标识符。**重要提示**：如果设置了此选项，则所有模块必须一致地使用相同的值。
- **用法**：仅当您的项目需要在与默认路径不同的路径中生成代码时（例如由于特定的编码规则或项目结构要求）才使用此选项。确保所有模块使用相同的软件包名称。

### KOIN_USE_COMPOSE_VIEWMODEL
- **类型**：Boolean
- **默认值**：`true`
- **说明**：使用 `koin-core-viewmodel` 主 DSL 而不是 Android 特定的 ViewModel 生成 ViewModel 定义。此选项默认启用，以提供 Kotlin Multiplatform 兼容性并使用统一的 ViewModel API。
- **用法**：建议对所有项目保持启用状态。对于需要跨平台 ViewModel 支持的 KMP 项目至关重要。

### KOIN_EXPORT_DEFINITIONS
- **类型**：Boolean
- **默认值**：`true`
- **说明**：控制除了模块组装的定义外，是否还生成导出的定义。禁用后，将仅生成在模块中组装的定义，并过滤掉独立的导出定义。
- **用法**：如果您只想生成在模块中显式组装的定义并排除独立的导出定义，请将其设置为 `false`。适用于更严格的模块组织。

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

## 最佳做法

- 在开发构建中 **启用 KOIN_CONFIG_CHECK** 以尽早捕获配置问题
- 在构建优化期间 **使用 KOIN_LOG_TIMES** 以识别性能瓶颈
- **仅在必要时使用 KOIN_GENERATION_PACKAGE** 以符合编码规则 - 并确保在所有模块中用法一致
- **保持 KOIN_USE_COMPOSE_VIEWMODEL 处于启用状态**（默认），以便在各平台使用统一的 ViewModel API
- **避免使用 KOIN_DEFAULT_MODULE** - 使用 `@Configuration` 和 `@KoinApplication` 进行正确的应用程序引导

## 软件包名称验证

使用 `KOIN_GENERATION_PACKAGE` 时，提供的软件包名称必须：
- 不能为空
- 仅包含由点分隔的有效 Kotlin 标识符
- 不使用 Kotlin 关键字或保留字
- 遵循标准 Java/Kotlin 软件包命名约定

无效的软件包名称将导致编译错误并显示描述性消息。