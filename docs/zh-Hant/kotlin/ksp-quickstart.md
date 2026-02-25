[//]: # (title: KSP 快速入門指南)

若要快速入門，你可以建立自己的處理器或取得[範例處理器](https://github.com/google/ksp/tree/main/examples/playground)。

## 新增處理器

若要新增處理器，你需要包含 KSP Gradle 外掛程式，並新增對處理器的相依性：

1. 將 KSP Gradle 外掛程式 `com.google.devtools.ksp` 新增到你的 `build.gradle(.kts)` 檔案中：

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

2. 新增對處理器的相依性。
本範例使用 [Dagger](https://dagger.dev/dev-guide/ksp.html)。請將其替換為你要新增的處理器。

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
   
   </tab>   </tabs>

3. 執行 `./gradlew build`。你可以在 `build/generated/ksp` 目錄中找到產生的程式碼。

以下是完整的範例：

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

## 建立你自己的處理器

1. 建立一個空的 Gradle 專案。
2. 在根專案中指定 Kotlin 外掛程式的版本 `%kspSupportedKotlinVersion%`，以便在其他專案模組中使用：

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

3. 新增一個用於裝載處理器的模組。

4. 在該模組的建置指令碼中，套用 Kotlin 外掛程式並在 `dependencies` 區塊中新增 KSP API。

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

5. 你需要實作 [`com.google.devtools.ksp.processing.SymbolProcessor`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) 和 [`com.google.devtools.ksp.processing.SymbolProcessorProvider`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt)。你的 `SymbolProcessorProvider` 實作將作為服務載入，用以具現化你實作的 `SymbolProcessor`。
   請注意以下幾點：
    * 實作 [`SymbolProcessorProvider.create()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt) 來建立一個 `SymbolProcessor`。透過 `SymbolProcessorProvider.create()` 的參數傳遞處理器需要的相依性（例如 `CodeGenerator`、處理器選項）。
    * 你的主要邏輯應放在 [`SymbolProcessor.process()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) 方法中。
    * 給定註解的完全限定名稱，使用 `resolver.getSymbolsWithAnnotation()` 來取得你想要處理的符號。
    * KSP 的一個常見使用案例是實作自訂訪問者（介面 `com.google.devtools.ksp.symbol.KSVisitor`）來操作符號。一個簡單的範本訪問者是 `com.google.devtools.ksp.symbol.KSDefaultVisitor`。
    * 關於 `SymbolProcessorProvider` 和 `SymbolProcessor` 介面的範例實作，請參閱範案專案中的以下檔案。
        * `src/main/kotlin/BuilderProcessor.kt`
        * `src/main/kotlin/TestProcessor.kt`
    * 編寫完你自己的處理器後，透過在 `src/main/resources/META-INF/services/com.google.devtools.ksp.processing.SymbolProcessorProvider` 中包含其完全限定名稱，將你的處理器提供者註冊到該套件中。

## 在專案中使用你自己的處理器

1. 建立另一個模組，其中包含你想要嘗試處理器的工作負載。

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

2. 在該模組的建置指令碼中，套用指定版本的 `com.google.devtools.ksp` 外掛程式，並將你的處理器新增到相依性清單中。

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

3. 執行 `./gradlew build`。你可以在 `build/generated/ksp` 下找到產生的程式碼。

以下是將 KSP 外掛程式套用於工作負載的範例建置指令碼：

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

## 向處理器傳遞選項

`SymbolProcessorEnvironment.options` 中的處理器選項是在 Gradle 建置指令碼中指定的：

```none
ksp {
    arg("option1", "value1")
    arg("option2", "value2")
    ...
}
```

## 讓 IDE 辨識產生的程式碼

> 自 KSP 1.8.0-1.0.9 起，產生的原始檔會自動註冊。如果你使用的是 KSP 1.0.9 或更新版本，且不需要讓 IDE 辨識產生的資源，可以跳過此章節。
>
{style="note"}

預設情況下，IntelliJ IDEA 或其他 IDE 不知道產生的程式碼。因此，它會將對產生符號的參考標記為無法解決。若要讓 IDE 能夠分析產生的符號，請將以下路徑標記為產生的原始碼根目錄：

```text
build/generated/ksp/main/kotlin/
build/generated/ksp/main/java/
```

如果你的 IDE 支援資源目錄，也請標記以下路徑：

```text
build/generated/ksp/main/resources/
```

可能還需要在你的 KSP 取用模組的建置指令碼中設定這些目錄：

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

如果你在 Gradle 外掛程式中使用 IntelliJ IDEA 和 KSP，則上述程式碼片段將會產生以下警告：
```text
Execution optimizations have been disabled for task ':publishPluginJar' to ensure correctness due to the following reasons:
Gradle detected a problem with the following location: '../build/generated/ksp/main/kotlin'. 
Reason: Task ':publishPluginJar' uses this output of task ':kspKotlin' without declaring an explicit or implicit dependency.
```

在這種情況下，請改用以下指令碼：

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