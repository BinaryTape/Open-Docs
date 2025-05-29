<!--- TOC -->

* [兼容性](#compatibility)
* [公共 API 类型](#public-api-types)
  * [实验性 API](#experimental-api)
  * [Flow 预览 API](#flow-preview-api)
  * [废弃 API](#obsolete-api)
  * [内部 API](#internal-api)
  * [稳定 API](#stable-api)
  * [废弃周期](#deprecation-cycle)
* [使用带注解的 API](#using-annotated-api)
  * [通过编程方式](#programmatically)
  * [Gradle](#gradle)
  * [Maven](#maven)

<!--- END -->

## 兼容性
本文档描述了 `kotlinx.coroutines` 库自 1.0.0 版本以来的兼容性策略，以及与兼容性相关的注解的语义。

## 公共 API 类型
`kotlinx.coroutines` 的公共 API 有五种类型：稳定、实验性、废弃、内部和已弃用。除了稳定 API 外，所有公共 API 都标有相应的注解。

### 实验性 API
实验性 API 标有 [@ExperimentalCoroutinesApi][ExperimentalCoroutinesApi] 注解。
当 API 的设计存在潜在的开放问题，这些问题可能最终导致 API 的语义变更或其被弃用时，该 API 会被标记为实验性。

默认情况下，大多数新 API 都被标记为实验性，并且如果在后续主要版本中没有出现新问题，它将在其中一个版本中变得稳定。
否则，要么在不改变 ABI 的情况下修复语义，要么 API 进入废弃周期。

使用实验性 API 可能危险的情况：
* 您正在编写一个依赖于 `kotlinx.coroutines` 的库，并希望在稳定的库 API 中使用实验性的协程 API。
这可能导致不希望的后果，即当您的库的最终用户更新其 `kotlinx.coroutines` 版本时，实验性 API 的语义可能略有不同。
* 您希望围绕实验性 API 构建应用程序的核心基础设施。

### Flow 预览 API
所有与 [Flow] 相关的 API 都标有 [@FlowPreview][FlowPreview] 注解。
此注解表明 Flow API 处于预览状态。
我们不为预览功能提供发布版本之间的兼容性保证，包括二进制、源码和语义兼容性。

使用预览 API 可能危险的情况：
* 您正在编写一个库/框架，并希望在稳定版本或稳定 API 中使用 [Flow] API。
* 您希望在应用程序的核心基础设施中使用 [Flow]。
* 您希望将 [Flow] 作为“即写即忘 (write-and-forget)”的解决方案，并且在 `kotlinx.coroutines` 更新时无法承担额外的维护成本。

### 废弃 API
废弃 API 标有 [@ObsoleteCoroutinesApi][ObsoleteCoroutinesApi] 注解。
废弃 API 类似于实验性 API，但已知其存在严重设计缺陷，并且有潜在的替代方案，但该替代方案尚未实现。

此 API 的语义不会改变，但一旦替代方案准备就绪，它将进入废弃周期。

### 内部 API
内部 API 标有 [@InternalCoroutinesApi][InternalCoroutinesApi] 注解或属于 `kotlinx.coroutines.internal` 包。
此 API 不保证其稳定性，在未来的版本中可能会更改和/或移除。
如果您无法避免使用内部 API，请将其报告到 [问题追踪器](https://github.com/Kotlin/kotlinx.coroutines/issues/new)。

### 稳定 API
稳定 API 保证保留其 ABI 和已文档化的语义。如果在某个时候发现无法修复的设计缺陷，
此 API 将进入废弃周期，并尽可能长时间地保持二进制兼容。

### 废弃周期
当某个 API 被弃用时，它将经历多个阶段，且每个阶段之间至少有一个主要版本间隔。
* 功能被弃用并附带编译警告。大多数情况下，会提供适当的替代方案（以及相应的 `replaceWith` 声明），以便借助 IntelliJ IDEA 自动迁移已弃用的用法。
* 弃用级别提升至 `error` 或 `hidden`。此时不再可能针对已弃用 API 编译新代码，尽管它仍然存在于 ABI 中。
* API 完全移除。尽管我们尽最大努力不这样做，并且目前没有移除任何 API 的计划，但我们仍保留此选项，以防出现安全漏洞等不可预见的问题。

## 使用带注解的 API
所有 API 注解都是 [kotlin.Experimental](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-experimental/)。
这样做是为了在使用实验性或废弃 API 时生成编译警告。
警告可以通过编程方式针对特定调用点禁用，或针对整个模块全局禁用。

### 通过编程方式
对于特定的调用点，可以通过使用 [OptIn](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/) 注解来禁用警告：
```kotlin
@OptIn(ExperimentalCoroutinesApi::class) // Disables warning about experimental coroutines API 
fun experimentalApiUsage() {
    someKotlinxCoroutinesExperimentalMethod()
}
``` 

### Gradle
对于 Gradle 项目，可以通过在 `build.gradle` 文件中传递编译器标志来禁用警告：

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.AbstractKotlinCompile).all {
    kotlinOptions.freeCompilerArgs += ["-Xuse-experimental=kotlinx.coroutines.ExperimentalCoroutinesApi"]
}

```

### Maven
对于 Maven 项目，可以通过在 `pom.xml` 文件中传递编译器标志来禁用警告：
```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    ... your configuration ...
    <configuration>
        <args>
            <arg>-Xuse-experimental=kotlinx.coroutines.ExperimentalCoroutinesApi</arg>
        </args>
    </configuration>
</plugin>
```

<!--- MODULE kotlinx-coroutines-core -->
<!--- INDEX kotlinx.coroutines.flow -->

[Flow]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/index.html

<!--- INDEX kotlinx.coroutines -->

[ExperimentalCoroutinesApi]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-experimental-coroutines-api/index.html
[FlowPreview]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-flow-preview/index.html
[ObsoleteCoroutinesApi]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-obsolete-coroutines-api/index.html
[InternalCoroutinesApi]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-internal-coroutines-api/index.html

<!--- END -->