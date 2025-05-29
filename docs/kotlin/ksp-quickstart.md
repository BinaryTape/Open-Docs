[//]: # (title: KSP 快速入门)

为了快速入门，您可以创建自己的处理器，或者获取一个[示例处理器](https://github.com/google/ksp/tree/main/examples/playground)。

## 添加处理器

要添加处理器，您需要引入 KSP Gradle 插件并添加对该处理器的依赖：

1.  将 KSP Gradle 插件 `com.google.devtools.ksp` 添加到您的 `build.gradle(.kts)` 文件中：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    plugins {
        id("com.google.devtools.ksp") version "%kspSupportedKotlinVersion%-%kspVersion%"
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    plugins {
        id 'com.google.devtools.ksp' version '%kspSupportedKotlinVersion%-%kspVersion%'
    }
    ```

    </tab>
    </tabs>

2.  添加对处理器的依赖。本示例使用 [Dagger](https://dagger.dev/dev-guide/ksp.html)。请将其替换为您要添加的处理器。

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

3.  运行 `./gradlew build`。您可以在 `build/generated/ksp` 目录中找到生成的代码。

以下是一个完整的示例：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("com.google.devtools.ksp") version "%kspSupportedKotlinVersion%-%kspVersion%"
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
    id 'com.google.devtools.ksp' version '%kspSupportedKotlinVersion%-%kspVersion%'
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

1.  创建一个空的 Gradle 项目。
2.  在根项目 (root project) 中指定 Kotlin 插件的 `%kspSupportedKotlinVersion%` 版本，供其他项目模块使用：

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

3.  添加一个模块用于承载处理器。

4.  在该模块的构建脚本中，应用 Kotlin 插件并将 KSP API 添加到 `dependencies` 代码块中。

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
        implementation("com.google.devtools.ksp:symbol-processing-api:%kspSupportedKotlinVersion%-%kspVersion%")
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
        implementation 'com.google.devtools.ksp:symbol-processing-api:%kspSupportedKotlinVersion%-%kspVersion%'
    }
    ```

    </tab>
    </tabs>

5.  您需要实现 [`com.google.devtools.ksp.processing.SymbolProcessor`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) 和 [`com.google.devtools.ksp.processing.SymbolProcessorProvider`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt)。您实现的 `SymbolProcessorProvider` 将作为一项服务加载，以实例化您实现的 `SymbolProcessor`。请注意以下几点：
    *   实现 [`SymbolProcessorProvider.create()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt) 来创建一个 `SymbolProcessor`。通过 `SymbolProcessorProvider.create()` 的参数传递您的处理器所需的依赖项（例如 `CodeGenerator`、处理器选项）。
    *   您的主要逻辑应位于 [`SymbolProcessor.process()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) 方法中。
    *   使用 `resolver.getSymbolsWithAnnotation()` 来获取您想要处理的符号，给定注解的完全限定名 (fully-qualified name)。
    *   KSP 的一个常见用例是实现一个自定义访问器 (visitor)（接口 `com.google.devtools.ksp.symbol.KSVisitor`）用于操作符号。一个简单的模板访问器是 `com.google.devtools.ksp.symbol.KSDefaultVisitor`。
    *   有关 `SymbolProcessorProvider` 和 `SymbolProcessor` 接口的示例实现，请参阅示例项目中的以下文件。
        *   `src/main/kotlin/BuilderProcessor.kt`
        *   `src/main/kotlin/TestProcessor.kt`
    *   在编写完自己的处理器后，通过将其完全限定名 (fully-qualified name) 包含在 `src/main/resources/META-INF/services/com.google.devtools.ksp.processing.SymbolProcessorProvider` 中来将其处理器提供者 (processor provider) 注册到包中。

## 在项目中使用自己的处理器

1.  创建另一个模块，该模块包含您希望试用处理器的`工作负载 (workload)`。

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

2.  在该模块的构建脚本中，应用指定版本的 `com.google.devtools.ksp` 插件，并将您的处理器添加到依赖项列表中。

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    plugins {
        id("com.google.devtools.ksp") version "%kspSupportedKotlinVersion%-%kspVersion%"
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
        id 'com.google.devtools.ksp' version '%kspSupportedKotlinVersion%-%kspVersion%'
    }

    dependencies {
        implementation 'org.jetbrains.kotlin:kotlin-stdlib:%kotlinVersion%'
        implementation project(':test-processor')
        ksp project(':test-processor')
    }
    ```

    </tab>
    </tabs>

3.  运行 `./gradlew build`。您可以在 `build/generated/ksp` 目录下找到生成的代码。

以下是一个示例构建脚本，用于将 KSP 插件应用于工作负载 (workload)：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("com.google.devtools.ksp") version "%kspSupportedKotlinVersion%-%kspVersion%"
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
    id 'com.google.devtools.ksp' version '%kspSupportedKotlinVersion%-%kspVersion%'
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

`SymbolProcessorEnvironment.options` 中的处理器选项在 Gradle 构建脚本中指定：

```none
ksp {
    arg("option1", "value1")
    arg("option2", "value2")
    ...
}
```

## 让 IDE 识别生成的代码

> 从 KSP 1.8.0-1.0.9 起，生成的源文件会自动注册。
> 如果您使用的是 KSP 1.0.9 或更高版本，并且不需要让 IDE 识别生成的资源，则可以跳过本节。
>
{style="note"}

默认情况下，IntelliJ IDEA 或其他 IDE 不知道生成的代码。因此它会将对生成符号的引用标记为无法解析。要使 IDE 能够理解生成的符号，请将以下路径标记为生成的源代码根目录 (generated source roots)：

```text
build/generated/ksp/main/kotlin/
build/generated/ksp/main/java/
```

如果您的 IDE 支持资源目录，也请标记以下路径：

```text
build/generated/ksp/main/resources/
```

可能还需要在 KSP 消费者模块 (KSP consumer module) 的构建脚本中配置这些目录：

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

如果您在 Gradle 插件中同时使用 IntelliJ IDEA 和 KSP，则上述代码片段将给出以下警告：
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