[//]: # (title: KSP 快速入门指南)

要快速入门，您可以创建自己的处理器或获取[示例处理器](https://github.com/google/ksp/tree/main/examples/playground)。

## 添加处理器

要添加处理器，您需要包含 KSP Gradle 插件并添加对该处理器的依赖项：

1. 将 KSP Gradle 插件 `com.google.devtools.ksp` 添加到您的 `build.gradle(.kts)` 文件中：

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">
   
   ```kotlin
   plugins {
       id("com.google.devtools.ksp") version "%kspVersion%"
   }
   ```
   
   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   plugins {
       id 'com.google.devtools.ksp' version '%kspVersion%'
   }
   ```
   
   </tab>
   </tabs>

2. 添加对处理器的依赖项。
本示例使用 [Dagger](https://dagger.dev/dev-guide/ksp.html)。请将其替换为您想要添加的处理器。

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">
   
   ```kotlin
   dependencies {
       implementation("com.google.dagger:dagger-compiler:2.51.1")
       ksp("com.google.dagger:dagger-compiler:2.51.1")
   }
   ```
   
   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   dependencies {
       implementation 'com.google.dagger:dagger-compiler:2.51.1'
       ksp 'com.google.dagger:dagger-compiler:2.51.1'
   }
   ```
   
   </tab>
   </tabs>

3. 运行 `./gradlew build`。您可以在 `build/generated/ksp` 目录中找到生成的代码。

以下是一个完整示例：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("com.google.devtools.ksp") version "%kspVersion%"
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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'com.google.devtools.ksp' version '%kspSupportedKotlinVersion%-%%'
    id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-stdlib:%kotlinVersion%'
    implementation 'com.google.dagger:dagger-compiler:2.51.1'
    ksp 'com.google.dagger:dagger-compiler:2.51.1'
}
```

</tab>
</tabs>

## 创建自己的处理器

1. 创建一个空的 Gradle 项目。
2. 在根项目中指定 Kotlin 插件的版本 `%kspSupportedKotlinVersion%`，以便在其他项目模块中使用：

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">
   
   ```kotlin
   plugins {
       kotlin("jvm") version "%kspSupportedKotlinVersion%" apply false
   }
   
   buildscript {
       dependencies {
           classpath(kotlin("gradle-plugin", version = "%kspSupportedKotlinVersion%"))
       }
   }
   ```
   
   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   plugins {
       id 'org.jetbrains.kotlin.jvm' version '%kspSupportedKotlinVersion%' apply false
   }
   
   buildscript {
       dependencies {
           classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:%kspSupportedKotlinVersion%'
       }
   }
   ```
   
   </tab>
   </tabs>

3. 添加一个用于承载处理器的模块。

4. 在模块的构建脚本中，应用 Kotlin 插件并将 KSP API 添加到 `dependencies` 代码块中。

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">
   
   ```kotlin
   plugins {
       kotlin("jvm")
   }
   
   repositories {
       mavenCentral()
   }
   
   dependencies {
       implementation("com.google.devtools.ksp:symbol-processing-api:%kspVersion%")
   }
   ```
   
   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   plugins {
       id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
   }
   
   repositories {
       mavenCentral()
   }
   
   dependencies {
       implementation 'com.google.devtools.ksp:symbol-processing-api:%kspVersion%'
   }
   ```
   
   </tab>
   </tabs>

5. 您需要实现 [`com.google.devtools.ksp.processing.SymbolProcessor`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) 和 [`com.google.devtools.ksp.processing.SymbolProcessorProvider`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt)。您的 `SymbolProcessorProvider` 实现将作为服务加载，用于实例化您实现的 `SymbolProcessor`。注意以下几点：
    * 实现 [`SymbolProcessorProvider.create()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt) 以创建 `SymbolProcessor`。通过 `SymbolProcessorProvider.create()` 的形参传递处理器所需的依赖项（如 `CodeGenerator`、处理器选项）。
    * 您的主要逻辑应位于 [`SymbolProcessor.process()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) 方法中。
    * 使用 `resolver.getSymbolsWithAnnotation()` 并提供注解的完全限定名称，以获取您想要处理的符号。
    * KSP 的一个常见用例是实现自定义访问器（`com.google.devtools.ksp.symbol.KSVisitor` 接口）以对符号进行操作。`com.google.devtools.ksp.symbol.KSDefaultVisitor` 是一个简单的模板访问器。
    * 有关 `SymbolProcessorProvider` 和 `SymbolProcessor` 接口的示例实现，请参阅示例项目中的以下文件。
        * `src/main/kotlin/BuilderProcessor.kt`
        * `src/main/kotlin/TestProcessor.kt`
    * 编写完自己的处理器后，通过在 `src/main/resources/META-INF/services/com.google.devtools.ksp.processing.SymbolProcessorProvider` 中包含其完全限定名称，将您的处理器提供程序注册到软件包中。

## 在项目中使用您自己的处理器

1. 创建另一个包含工作负载的模块，以便在其中尝试您的处理器。

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">
   
   ```kotlin
   pluginManagement { 
       repositories { 
           gradlePluginPortal()
       }
   }
   ```
   
   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   pluginManagement {
       repositories {
           gradlePluginPortal()
       }
   }
    ```
   
   </tab>
   </tabs>

2. 在模块的构建脚本中，应用指定版本的 `com.google.devtools.ksp` 插件，并将您的处理器添加到依赖项列表中。

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">
   
   ```kotlin
   plugins {
       id("com.google.devtools.ksp") version "%kspVersion%"
   }
   
   dependencies {
       implementation(kotlin("stdlib-jdk8"))
       implementation(project(":test-processor"))
       ksp(project(":test-processor"))
   }
   ```
   
   </tab>
   <tab title="Groovy" group-key="groovy">
   
   ```groovy
   plugins {
       id 'com.google.devtools.ksp' version '%kspVersion%'
   }
   
   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-stdlib:%kotlinVersion%'
       implementation project(':test-processor')
       ksp project(':test-processor')
   }
   ```
   
   </tab>
   </tabs>

3. 运行 `./gradlew build`。您可以在 `build/generated/ksp` 下找到生成的代码。

以下是将 KSP 插件应用于工作负载的示例构建脚本：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("com.google.devtools.ksp") version "%kspVersion%"
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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'com.google.devtools.ksp' version '%kspVersion%'
    id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-stdlib:%kotlinVersion%'
    implementation project(':test-processor')
    ksp project(':test-processor')
}
```

</tab>
</tabs>

## 向处理器传递选项

`SymbolProcessorEnvironment.options` 中的处理器选项是在 Gradle 构建脚本中指定的：

```none
ksp {
    arg("option1", "value1")
    arg("option2", "value2")
    ...
}
```

## 让 IDE 识别生成的代码

> 自 KSP 1.8.0-1.0.9 起，生成的源文件会自动注册。如果您使用的是 KSP 1.0.9 或更新版本，且不需要让 IDE 识别生成的资源，可以跳过本节。
>
{style="note"}

默认情况下，IntelliJ IDEA 或其他 IDE 无法识别生成的代码。因此，它会将对生成符号的引用标记为未解析。为了让 IDE 能够推断生成的符号，请将以下路径标记为生成的源根：

```text
build/generated/ksp/main/kotlin/
build/generated/ksp/main/java/
```

如果您的 IDE 支持资源目录，也请标记以下目录：

```text
build/generated/ksp/main/resources/
```

可能还必须在您的 KSP 使用者模块的构建脚本中配置这些目录：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    sourceSets {
        main.kotlin.srcDirs += 'build/generated/ksp/main/kotlin'
        test.kotlin.srcDirs += 'build/generated/ksp/test/kotlin'
    }
}
```

</tab>
</tabs>

如果您在 Gradle 插件中使用 IntelliJ IDEA 和 KSP，则上述代码段会产生以下警告：
```text
Execution optimizations have been disabled for task ':publishPluginJar' to ensure correctness due to the following reasons:
Gradle detected a problem with the following location: '../build/generated/ksp/main/kotlin'. 
Reason: Task ':publishPluginJar' uses this output of task ':kspKotlin' without declaring an explicit or implicit dependency.
```

在这种情况下，请改用以下脚本：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>