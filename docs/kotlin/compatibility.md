<!--- TOC -->

* [兼容性](#compatibility)
* [公共 API 类型](#public-api-types)
  * [实验性的 API](#experimental-api)
  * [Flow 预览 API](#flow-preview-api)
  * [废弃的 API](#obsolete-api)
  * [内部 API](#internal-api)
  * [稳定的 API](#stable-api)
  * [废弃周期](#deprecation-cycle)
* [使用带注解的 API](#using-annotated-api)
  * [通过编程方式](#programmatically)
  * [Gradle](#gradle)
  * [Maven](#maven)

<!--- END -->

## 兼容性
本文档描述了 `kotlinx.coroutines` 库自 1.0.0 版本以来的兼容性策略，以及兼容性相关注解的语义。

## 公共 API 类型
`kotlinx.coroutines` 公共 API 分为五种类型：稳定的、实验性的、废弃的、内部的和弃用的。除稳定的公共 API 外，所有 API 都标有对应的注解。

### 实验性的 API
实验性的 API 标有 [@ExperimentalCoroutinesApi][ExperimentalCoroutinesApi] 注解。当 API 的设计存在潜在的开放问题，可能最终导致 API 的语义变更或弃用时，该 API 会被标记为实验性的。

默认情况下，大多数新 API 都被标记为实验性的，并且在没有新问题出现的情况下，会在后续的某个主要版本中变为稳定的。否则，API 的语义将在不改变 ABI 的情况下得到修复，或者该 API 会进入废弃周期。

何时使用实验性的 API 可能存在危险：
* 你正在编写一个依赖于 `kotlinx.coroutines` 的库，并且希望在稳定的库 API 中使用实验性的协程 API。当你库的最终用户更新他们的 `kotlinx.coroutines` 版本，而其中实验性的 API 语义略有不同时，这可能导致不良后果。
* 你希望围绕实验性的 API 构建应用程序的核心基础设施。

### Flow 预览 API
所有 [Flow] 相关的 API 都标有 [@FlowPreview][FlowPreview] 注解。此注解表明 Flow API 处于预览状态。对于预览特性，我们不提供版本间的兼容性保证，包括二进制兼容性、源代码兼容性以及语义兼容性。

何时使用预览 API 可能存在危险：
* 你正在编写一个库/框架，并且希望在稳定版本或稳定的 API 中使用 [Flow] API。
* 你希望在应用程序的核心基础设施中使用 [Flow]。
* 你希望将 [Flow] 用作“即写即忘”的解决方案，并且无法承担 `kotlinx.coroutines` 更新时产生的额外维护成本。

### 废弃的 API
废弃的 API 标有 [@ObsoleteCoroutinesApi][ObsoleteCoroutinesApi] 注解。废弃的 API 与实验性的 API 相似，但已知存在严重的设计缺陷，并且存在潜在的替代方案，但该替代方案尚未实现。

此 API 的语义不会改变，但一旦替代方案准备就绪，它将进入废弃周期。

### 内部 API
内部 API 标有 [@InternalCoroutinesApi][InternalCoroutinesApi] 注解或属于 `kotlinx.coroutines.internal` 包。此 API 不保证其稳定性，在未来版本中可能会被更改和/或移除。如果你无法避免使用内部 API，请将其报告给 [问题跟踪器](https://github.com/Kotlin/kotlinx.coroutines/issues/new)。

### 稳定的 API
稳定的 API 保证保留其 ABI 和文档化的语义。如果在某个时候发现无法修复的设计缺陷，此 API 将进入废弃周期，并尽可能长时间地保持二进制兼容。

### 废弃周期
当某个 API 被弃用时，它会经历多个阶段，且每个阶段之间至少有一个主要版本。
* 特性被弃用并带有编译警告。大多数情况下，都会提供适当的替代方案（以及相应的 `replaceWith` 声明），以便借助 IntelliJ IDEA 自动迁移弃用的用法。
* 弃用级别提升为 `error` 或 `hidden`。此时已无法再针对弃用的 API 编译新代码，尽管它仍然存在于 ABI 中。
* API 被完全移除。尽管我们尽最大努力不这样做，也没有移除任何 API 的计划，但我们仍保留此选项，以防出现安全漏洞等无法预见的问题。

## 使用带注解的 API
所有 API 注解都是 [kotlin.Experimental](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-experimental/)。这样做是为了在使用实验性的或废弃的 API 时产生编译警告。警告可以通过编程方式在特定调用点禁用，或全局禁用整个模块。

### 通过编程方式
对于特定调用点，可以使用 [OptIn](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/) 注解禁用警告：
```kotlin
@OptIn(ExperimentalCoroutinesApi::class) // 禁用关于实验性协程 API 的警告
fun experimentalApiUsage() {
    someKotlinxCoroutinesExperimentalMethod()
}
```

### Gradle
对于 Gradle 项目，可以通过在 `build.gradle` 文件中传递一个编译器标志来禁用警告：

```groovy
tasks.withType(org.jetbrains.kotlin.gradle.tasks.AbstractKotlinCompile).all {
    kotlinOptions.freeCompilerArgs += ["-Xuse-experimental=kotlinx.coroutines.ExperimentalCoroutinesApi"]
}

```

### Maven
对于 Maven 项目，可以通过在 `pom.xml` 文件中传递一个编译器标志来禁用警告：
```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    ... 你的配置 ...
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