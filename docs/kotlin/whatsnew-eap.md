[//]: # (title: Kotlin %kotlinEapVersion% 最新变化)

<primary-label ref="eap"/>

<web-summary>阅读 Kotlin 抢先体验计划发布说明，并在最新的实验性 Kotlin 功能正式发布之前进行试用。</web-summary>

_[发布日期：%kotlinEapReleaseDate%](eap.md#build-details)_

> 本文档并未涵盖抢先体验计划 (EAP) 版本的所有功能，
> 但它重点介绍了其中的一些重大改进。
>
> 欲查看完整的更改列表，请参阅 [GitHub 变更日志](https://github.com/JetBrains/kotlin/releases/tag/v%kotlinEapVersion%)。
>
{style="note"}

Kotlin %kotlinEapVersion% 版本已发布！以下是此 EAP 版本的一些详细信息：

* **Kotlin 编译器插件**：[Lombok 现为 Alpha 阶段](#lombok-is-now-alpha) 以及 [`kotlin.plugin.jpa` 插件中改进的 JPA 支持](#improved-jpa-support-in-the-kotlin-plugin-jpa-plugin)
* **Kotlin/Native**：[针对 C 和 Objective-C 库的新互操作模式](#kotlin-native-new-interoperability-mode-for-c-or-objective-c-libraries)
* **Gradle**：[兼容 Gradle 9.3.0](#compatibility-with-gradle-9-3-0) 以及 [Kotlin/JVM 编译默认使用 BTA](#kotlin-jvm-compilation-uses-build-tools-api-by-default)
* **Maven**：[简化 Kotlin 项目设置](#maven-simplified-setup-for-kotlin-projects)
* **标准库**：[用于创建 `Map.Entry` 不可变副本的新 API](#standard-library-new-api-for-creating-immutable-copies-of-map-entry)

> 有关 Kotlin 发布周期的信息，请参阅 [Kotlin 发布流程](releases.md)。
>
{style="tip"}

## IDE 支持

支持 %kotlinEapVersion% 的 Kotlin 插件已捆绑在最新版本的 IntelliJ IDEA 和 Android Studio 中。
您无需更新 IDE 中的 Kotlin 插件。
您只需在构建脚本中将 [Kotlin 版本更改](configure-build-for-eap.md)为 %kotlinEapVersion% 即可。

有关详情，请参阅[更新到新版本](releases.md#update-to-a-new-kotlin-version)。

## Kotlin 编译器插件

Kotlin %kotlinEapVersion% 为 Lombok 和 `kotlin.plugin.jpa` 编译器插件带来了重要更新。

### Lombok 现已进入 Alpha 阶段
<primary-label ref="alpha"/>

Kotlin 1.5.20 引入了实验性的 [Lombok 编译器插件](lombok.md)，它允许您在混合使用 Kotlin 和 Java 代码的模块中生成并使用 [Java 的 Lombok 声明](https://projectlombok.org/)。

在 %kotlinEapVersion% 中，Lombok 编译器插件已提升至 [Alpha](components-stability.md#stability-levels-explained) 阶段，因为我们计划将此功能产品化，但它目前仍在开发中。

### 改进了 `kotlin.plugin.jpa` 插件中的 JPA 支持

除了现有的 [`no-arg`](no-arg-plugin.md) 支持外，`kotlin.plugin.jpa` 插件现在还会通过新增的内置 JPA 预设自动应用 [`all-open`](all-open-plugin.md) 编译器插件。

此前，使用 `kotlin("plugin.jpa")` 仅会启用带有 JPA 预设的 `no-arg` 插件。而在处理 JPA 实体时，您必须显式应用并配置 `all-open` 插件，才能使 JPA 实体类变为 `open`。

从 Kotlin %kotlinEapVersion% 开始：

* `all-open` 编译器插件提供了一个 JPA 预设。
* Gradle `org.jetbrains.kotlin.plugin.jpa` 插件会自动应用启用了 JPA 预设的 `org.jetbrains.kotlin.plugin.all-open` 插件。
* [Maven JPA 设置](no-arg-plugin.md#jpa-support)默认启用带有 JPA 预设的 `all-open`。
* Maven 依赖项 `org.jetbrains.kotlin:kotlin-maven-noarg` 现在隐式包含 `org.jetbrains.kotlin:kotlin-maven-allopen`，因此您不再需要在 `<plugin><dependencies>` 块中显式添加它。

因此，带有以下注解的 JPA 实体
会自动被视为 `open`，并且无需额外配置即可获得无参构造函数：

* `javax.persistence.Entity`
* `javax.persistence.Embeddable`
* `javax.persistence.MappedSuperclass`
* `jakarta.persistence.Entity`
* `jakarta.persistence.Embeddable`
* `jakarta.persistence.MappedSuperclass`

这一更改简化了构建配置，并提升了在 JPA 框架中使用 Kotlin 时的开箱即用体验。

## Kotlin/Native：针对 C 或 Objective-C 库的新互操作模式
<primary-label ref="experimental-opt-in"/>

如果您在 Kotlin Multiplatform 库或应用程序中使用 C 或 Objective-C 库，我们邀请您测试新的互操作模式并分享结果。

通常，Kotlin/Native 支持将 C 和 Objective-C 库导入 Kotlin。然而，对于 Kotlin Multiplatform 库，此功能目前会[受到](native-lib-import-stability.md#stability-of-c-and-objective-c-library-import) KMP 与旧版本编译器的兼容性问题影响。

换句话说，如果您发布了一个使用某个 Kotlin 版本编译的 Kotlin Multiplatform 库，导入 C 或 Objective-C 库可能会导致无法在较早 Kotlin 版本的项目中使用该 Kotlin 库。

为了解决这一问题以及其他问题，Kotlin 团队一直在修订底层使用的互操作机制。从 Kotlin 2.3.20-Beta1 开始，您可以通过编译器选项尝试这种新模式。

#### 如何尝试

1. 在您的 Gradle 构建文件中，检查是否有 `cinterops {}` 块或 `pod()` 依赖项。如果存在，说明您的项目使用了 C 或 Objective-C 库。
2. 确保您的项目使用的是 `2.3.20-Beta1` 或更高版本。
3. 在同一个构建文件中，将 `-Xccall-mode` 编译器选项添加到 cinterop 工具调用中：

    ```kotlin
    kotlin {
        targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget>().configureEach {
            compilations.configureEach {
                cinterops.configureEach {
                    extraOpts += listOf("-Xccall-mode", "direct")
                }
            }
        }
    }
    ```

4. 像往常一样通过运行单元测试、应用等来构建并测试您的项目。

    您还可以使用 `--continue` 选项允许 Gradle 在失败后继续执行任务，这有助于一次性发现更多问题。

> 请**不要**发布使用新互操作模式编译的库，因为该模式目前仍处于[实验性](components-stability.md#stability-levels-explained)阶段。
>
{style="warning"}

#### 报告您的结果

新的互操作模式在大多数情况下应该是可以无缝替换的。
我们计划最终默认启用它。但为了实现这一目标，我们需要确保它的运行效果尽可能好，并在广泛的项目中进行测试，因为：

* 一些 C 和 Objective-C 声明在新模式中尚未受支持（主要是因为它们与兼容性问题冲突）。我们希望更好地了解这在实际应用中的影响，并据此确定后续步骤的优先级。
* 可能存在错误或我们未考虑到的情况。测试具有众多交互功能的语言具有挑战性，而测试语言之间的交互（每种语言都具有独特的功能集）则更具挑战性。

请帮助我们检查实际项目并识别具有挑战性的案例。
无论您是否遇到任何问题，都请在 [此 YouTrack 问题](https://youtrack.jetbrains.com/issue/KT-83218) 的评论中分享您的结果。

## Gradle

Kotlin %kotlinEapVersion% 与新版本的 Gradle 兼容，并包含了 Kotlin Gradle 插件中 Kotlin/JVM 编译的更改。

### 兼容 Gradle 9.3.0

Kotlin %kotlinEapVersion% 与 Gradle 7.6.3 至 9.3.0 完全兼容。您也可以使用截至最新版本的 Gradle。但请注意，这样做可能会导致弃用警告，且某些新的 Gradle 功能可能无法正常工作。

### Kotlin/JVM 编译默认使用构建工具 API
<primary-label ref="experimental-general"/>

在 Kotlin %kotlinEapVersion% 中，Kotlin Gradle 插件中的 Kotlin/JVM 编译默认使用[构建工具 API](build-tools-api.md) (BTA)。内部编译基础架构的这一更改可以加快 Kotlin 编译器构建工具支持的开发速度。

如果您发现任何问题，请在我们的[问题跟踪器](https://youtrack.jetbrains.com/newIssue?project=KT&summary=Kotlin+Gradle+plugin+BTA+migration+issue&description=Describe+the+problem+you+encountered+here.&c=tag+kgp-bta-migration)中分享您的反馈。

## Maven：简化 Kotlin 项目设置

Kotlin %kotlinEapVersion% 使在 Maven 项目中设置 Kotlin 变得更加容易。现在 Kotlin 支持自动配置源根和 Kotlin 标准库。

通过新的配置，当您使用 Maven 构建系统创建新的 Kotlin 项目，或将 Kotlin 引入现有的 Java Maven 项目时，您无需手动创建源根或在 POM 构建文件中添加 `kotlin-stdlib` 依赖项。

### 如何启用

在您的 `pom.xml` 文件中，将 `<extensions>true</extensions>` 添加到 Kotlin Maven 插件的 `<build><plugins>` 部分：

```xml
<build>
    <plugins>
         <plugin>
             <groupId>org.jetbrains.kotlin</groupId>
             <artifactId>kotlin-maven-plugin</artifactId>
             <version>%kotlinEapVersion%</version>
             <extensions>true</extensions> <!-- 添加此扩展 -->
         </plugin>
    </plugins>
</build>
```

新的扩展会自动执行以下操作：

* 创建 `src/main/kotlin` 和 `src/test/kotlin` 目录，而不更改现有的 Kotlin 或 Java 源根。
* 除非已经定义，否则添加 `kotlin-stdlib` 依赖项。

您也可以选择退出自动添加 Kotlin 标准库。为此，请在 `<properties>` 部分添加以下内容：

```xml
<project>
    <properties>
        <!-- 通过属性禁用智能默认设置 -->
        <kotlin.smart.defaults.enabled>false</kotlin.smart.defaults.enabled>
    </properties>
</project>
```

有关 Kotlin 项目中 Maven 配置的更多信息，请参阅[配置 Maven 项目](maven-configure-project.md)。

## 标准库：用于创建 `Map.Entry` 不可变副本的新 API
<primary-label ref="experimental-opt-in"/>

Kotlin %kotlinEapVersion% 引入了 `Map.Entry.copy()` 扩展函数，用于创建 [`Map.Entry`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-map/-entry/) 的不可变副本。
此函数允许您在修改 map 后，通过先复制 entry，来重用从 [`Map.entries`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/-map/entries.html) 获取的 entry。

`Map.Entry.copy()` 处于 [实验性](components-stability.md#stability-levels-explained) 阶段。要启用它，请使用 `@OptIn(ExperimentalStdlibApi::class)` 注解或编译器选项 `-opt-in=kotlin.ExperimentalStdlibApi`。

以下是使用 `Map.Entry.copy()` 从可变 map 中移除 entry 的示例：

```kotlin
@OptIn(ExperimentalStdlibApi::class)
fun main() {
    val map = mutableMapOf(1 to 1, 2 to 2, 3 to 3, 4 to 4)

    val toRemove = map.entries
        .filter { it.key % 2 == 0 }
        .map { it.copy() }

    map.entries.removeAll(toRemove)

    println("map = $map")
    // map = {1=1, 3=3}
}