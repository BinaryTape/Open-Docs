---
title: "KSP 快速入門"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

若要快速開始，您可以建立自己的處理器（processor）或取得[範例](https://github.com/google/ksp/tree/main/examples/playground)。

## 新增處理器（processor）

要新增處理器（processor），您需要包含 KSP Gradle 插件（Plugin）並新增對處理器（processor）的依賴：

1. 將 KSP Gradle 插件 `com.google.devtools.ksp` 新增到您的 `build.gradle(.kts)` 檔案中：

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

2. 新增對處理器（processor）的依賴。
此範例使用 [Dagger](https://dagger.dev/dev-guide/ksp.html)。 將其替換為您要新增的處理器（processor）。

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

3. 執行 `./gradlew build`。 您可以在 `build/generated/ksp` 目錄中找到產生的程式碼。

這是一個完整的範例：

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

## 建立您自己的處理器（processor）

1. 建立一個空的 gradle 專案。
2. 在根專案中指定 Kotlin 插件的版本 `2.1.10`，以供其他專案模組使用：

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

3. 新增一個用於託管處理器（processor）的模組。

4. 在模組的建置腳本中，套用 Kotlin 插件，並將 KSP API 新增到 `dependencies` 區塊。

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

5. 您需要實作 [`com.google.devtools.ksp.processing.SymbolProcessor`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt)
   和 [`com.google.devtools.ksp.processing.SymbolProcessorProvider`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt)。
   您的 `SymbolProcessorProvider` 實作將作為服務載入，以實例化您實作的 `SymbolProcessor`。
   請注意以下事項：
    * 實作 [`SymbolProcessorProvider.create()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt)
      以建立 `SymbolProcessor`。 透過 `SymbolProcessorProvider.create()` 的參數傳遞您的處理器（processor）需要的依賴項（例如 `CodeGenerator`、處理器（processor）選項）。
    * 您的主要邏輯應該在 [`SymbolProcessor.process()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) 方法中。
    * 使用 `resolver.getSymbolsWithAnnotation()` 取得您要處理的符號，給定註解的完整名稱。
    * KSP 的常見用例是實作一個自訂的訪問器（visitor）（介面 `com.google.devtools.ksp.symbol.KSVisitor`）以對符號進行操作。 一個簡單的範本訪問器是 `com.google.devtools.ksp.symbol.KSDefaultVisitor`。
    * 有關 `SymbolProcessorProvider` 和 `SymbolProcessor` 介面的範例實作，請參閱範例專案中的以下檔案。
        * `src/main/kotlin/BuilderProcessor.kt`
        * `src/main/kotlin/TestProcessor.kt`
    * 寫完您自己的處理器（processor）後，透過在 `src/main/resources/META-INF/services/com.google.devtools.ksp.processing.SymbolProcessorProvider` 中包含其完整名稱，將您的處理器（processor）提供者註冊到套件。

## 在專案中使用您自己的處理器（processor）

1. 建立另一個包含工作負載的模組，您想在其中試用您的處理器（processor）。

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

2. 在模組的建置腳本中，套用具有指定版本的 `com.google.devtools.ksp` 插件，並將您的處理器（processor）新增到依賴項清單中。

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

3. 執行 `./gradlew build`。 您可以在 `build/generated/ksp` 下找到產生的程式碼。

這是一個範例建置腳本，用於將 KSP 插件套用到工作負載：

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

## 將選項傳遞給處理器（processor）

`SymbolProcessorEnvironment.options` 中的處理器（processor）選項在 gradle 建置腳本中指定：

```none
ksp {
    arg("option1", "value1")
    arg("option2", "value2")
    ...
}
```

## 使 IDE 意識到產生的程式碼

:::note
自 KSP 1.8.0-1.0.9 以來，產生的原始碼檔案會自動註冊。
如果您使用的是 KSP 1.0.9 或更新版本，並且不需要使 IDE 意識到產生的資源，
請隨時跳過此部分。

:::

預設情況下，IntelliJ IDEA 或其他 IDE 不知道產生的程式碼。 因此，它將標記對產生的符號的引用為無法解析。 若要使 IDE 能夠推理產生的符號，請將以下路徑標記為產生的原始碼根目錄：

```text
build/generated/ksp/main/kotlin/
build/generated/ksp/main/java/
```

如果您的 IDE 支援資源目錄，也請標記以下目錄：

```text
build/generated/ksp/main/resources/
```

也可能需要在 KSP 消費者模組的建置腳本中配置這些目錄：

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

如果您在 Gradle 插件中使用 IntelliJ IDEA 和 KSP，則上述程式碼片段將提供以下警告：
```text
Execution optimizations have been disabled for task ':publishPluginJar' to ensure correctness due to the following reasons:
Gradle detected a problem with the following location: '../build/generated/ksp/main/kotlin'. 
Reason: Task ':publishPluginJar' uses this output of task ':kspKotlin' without declaring an explicit or implicit dependency.
```

在這種情況下，請改用以下腳本：

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