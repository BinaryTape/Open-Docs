---
title: "KSP 快速入门"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

为了快速开始，您可以创建自己的 processor（处理器），或者获取一个[示例](https://github.com/google/ksp/tree/main/examples/playground)。

## 添加一个 Processor（处理器）

要添加一个 processor（处理器），您需要包含 KSP Gradle 插件，并添加对该 processor（处理器）的依赖：

1. 将 KSP Gradle 插件 `com.google.devtools.ksp` 添加到您的 `build.gradle(.kts)` 文件中：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    id("com.google.devtools.ksp") version "2.1.10-1.0.31"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'com.google.devtools.ksp' version '2.1.10-1.0.31'
}
```

</TabItem>
</Tabs>

2. 添加对该 processor（处理器）的依赖。
此示例使用 [Dagger](https://dagger.dev/dev-guide/ksp.html)。将其替换为您想要添加的 processor（处理器）。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
dependencies {
    implementation("com.google.dagger:dagger-compiler:2.51.1")
    ksp("com.google.dagger:dagger-compiler:2.51.1")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
dependencies {
    implementation 'com.google.dagger:dagger-compiler:2.51.1'
    ksp 'com.google.dagger:dagger-compiler:2.51.1'
}
```

</TabItem>
</Tabs>

3. 运行 `./gradlew build`。您可以在 `build/generated/ksp` 目录中找到生成的代码。

这是一个完整的例子：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    id("com.google.devtools.ksp") version "2.1.10-1.0.31"
    kotlin("jvm")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib-jdk8"))
    implementation("com.google.dagger:dagger-compiler:2.51.1")
    ksp("com.google.dagger:dagger-compiler:2.51.1")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'com.google.devtools.ksp' version '2.1.10-1.0.31'
    id 'org.jetbrains.kotlin.jvm' version '2.1.20'
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-stdlib:2.1.20'
    implementation 'com.google.dagger:dagger-compiler:2.51.1'
    ksp 'com.google.dagger:dagger-compiler:2.51.1'
}
```

</TabItem>
</Tabs>

## 创建您自己的 Processor（处理器）

1. 创建一个空的 gradle 项目。
2. 在根项目中指定 Kotlin 插件的版本 `2.1.10`，以便在其他项目模块中使用：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("jvm") version "2.1.10" apply false
}

buildscript {
    dependencies {
        classpath(kotlin("gradle-plugin", version = "2.1.10"))
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.jvm' version '2.1.10' apply false
}

buildscript {
    dependencies {
        classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:2.1.10'
    }
}
```

</TabItem>
</Tabs>

3. 添加一个用于托管 processor（处理器）的模块。

4. 在模块的构建脚本中，应用 Kotlin 插件并将 KSP API 添加到 `dependencies` 代码块。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("jvm")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.google.devtools.ksp:symbol-processing-api:2.1.10-1.0.31")
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.jvm' version '2.1.20'
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'com.google.devtools.ksp:symbol-processing-api:2.1.10-1.0.31'
}
```

</TabItem>
</Tabs>

5. 您需要实现 [`com.google.devtools.ksp.processing.SymbolProcessor`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt)
   和 [`com.google.devtools.ksp.processing.SymbolProcessorProvider`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt)。
   您的 `SymbolProcessorProvider` 实现将被加载为一个服务，用于实例化您实现的 `SymbolProcessor`。
   请注意以下事项：
    * 实现 [`SymbolProcessorProvider.create()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt)
      来创建一个 `SymbolProcessor`。通过 `SymbolProcessorProvider.create()` 的参数传递您的 processor（处理器）需要的依赖项（例如 `CodeGenerator`，processor（处理器）选项）。
    * 您的主要逻辑应该在 [`SymbolProcessor.process()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) 方法中。
    * 使用 `resolver.getSymbolsWithAnnotation()` 获取您想要处理的 symbols (符号)，给定一个 annotation (注解) 的完全限定名称。
    * KSP 的一个常见用例是实现一个自定义的 visitor (访问器)（接口 `com.google.devtools.ksp.symbol.KSVisitor`）来操作 symbols (符号)。一个简单的模板 visitor (访问器) 是 `com.google.devtools.ksp.symbol.KSDefaultVisitor`。
    * 有关 `SymbolProcessorProvider` 和 `SymbolProcessor` 接口的示例实现，请参阅示例项目中的以下文件。
        * `src/main/kotlin/BuilderProcessor.kt`
        * `src/main/kotlin/TestProcessor.kt`
    * 在编写了自己的 processor（处理器）之后，通过在 `src/main/resources/META-INF/services/com.google.devtools.ksp.processing.SymbolProcessorProvider` 中包含其完全限定名称，将您的 processor（处理器） provider（提供者）注册到包中。

## 在项目中使用您自己的 Processor（处理器）

1. 创建另一个包含 workload (工作负载) 的模块，您可以在其中试用您的 processor（处理器）。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
pluginManagement { 
    repositories { 
        gradlePluginPortal()
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
pluginManagement {
    repositories {
        gradlePluginPortal()
    }
}
 ```

</TabItem>
</Tabs>

2. 在模块的构建脚本中，应用指定版本的 `com.google.devtools.ksp` 插件，并将您的 processor（处理器）添加到依赖项列表中。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    id("com.google.devtools.ksp") version "2.1.10-1.0.31"
}

dependencies {
    implementation(kotlin("stdlib-jdk8"))
    implementation(project(":test-processor"))
    ksp(project(":test-processor"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'com.google.devtools.ksp' version '2.1.10-1.0.31'
}

dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version'
    implementation project(':test-processor')
    ksp project(':test-processor')
}
```

</TabItem>
</Tabs>

3. 运行 `./gradlew build`。您可以在 `build/generated/ksp` 下找到生成的代码。

这是一个将 KSP 插件应用于 workload (工作负载) 的示例构建脚本：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    id("com.google.devtools.ksp") version "2.1.10-1.0.31"
    kotlin("jvm") 
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib-jdk8"))
    implementation(project(":test-processor"))
    ksp(project(":test-processor"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'com.google.devtools.ksp' version '2.1.10-1.0.31'
    id 'org.jetbrains.kotlin.jvm' version '2.1.20'
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-stdlib:2.1.20'
    implementation project(':test-processor')
    ksp project(':test-processor')
}
```

</TabItem>
</Tabs>

## 将选项传递给 Processor（处理器）

`SymbolProcessorEnvironment.options` 中的 processor（处理器）选项在 gradle 构建脚本中指定：

```none
ksp {
    arg("option1", "value1")
    arg("option2", "value2")
    ...
}
```

## 使 IDE 识别生成的代码

:::note
自 KSP 1.8.0-1.0.9 以来，生成的源文件会自动注册。
如果您使用的是 KSP 1.0.9 或更高版本，并且不需要使 IDE 识别生成的资源，
请随意跳过此部分。

:::

默认情况下，IntelliJ IDEA 或其他 IDE 不知道生成的代码。 因此，它会将对生成的
symbols (符号) 的引用标记为无法解析。 要使 IDE 能够推断生成的 symbols (符号)，请将
以下路径标记为生成的源根目录：

```text
build/generated/ksp/main/kotlin/
build/generated/ksp/main/java/
```

如果您的 IDE 支持资源目录，请同时标记以下目录：

```text
build/generated/ksp/main/resources/
```

也可能需要在您的 KSP consumer (消费者) 模块的构建脚本中配置这些目录：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets.main {
        kotlin.srcDir("build/generated/ksp/main/kotlin")
    }
    sourceSets.test {
        kotlin.srcDir("build/generated/ksp/test/kotlin")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        main.kotlin.srcDirs += 'build/generated/ksp/main/kotlin'
        test.kotlin.srcDirs += 'build/generated/ksp/test/kotlin'
    }
}
```

</TabItem>
</Tabs>

如果您在 Gradle 插件中使用 IntelliJ IDEA 和 KSP，则上述代码段将给出以下警告：
```text
Execution optimizations have been disabled for task ':publishPluginJar' to ensure correctness due to the following reasons:
Gradle detected a problem with the following location: '../build/generated/ksp/main/kotlin'. 
Reason: Task ':publishPluginJar' uses this output of task ':kspKotlin' without declaring an explicit or implicit dependency.
```

在这种情况下，请改用以下脚本：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    // ...
    idea
}

idea {
    module {
        // Not using += due to https://github.com/gradle/gradle/issues/8749
        sourceDirs = sourceDirs + file("build/generated/ksp/main/kotlin") // or tasks["kspKotlin"].destination
        testSourceDirs = testSourceDirs + file("build/generated/ksp/test/kotlin")
        generatedSourceDirs = generatedSourceDirs + file("build/generated/ksp/main/kotlin") + file("build/generated/ksp/test/kotlin")
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    // ...
    id 'idea'
}

idea {
    module {
        // Not using += due to https://github.com/gradle/gradle/issues/8749
        sourceDirs = sourceDirs + file('build/generated/ksp/main/kotlin') // or tasks["kspKotlin"].destination
        testSourceDirs = testSourceDirs + file('build/generated/ksp/test/kotlin')
        generatedSourceDirs = generatedSourceDirs + file('build/generated/ksp/main/kotlin') + file('build/generated/ksp/test/kotlin')
    }
}
```

</TabItem>
</Tabs>