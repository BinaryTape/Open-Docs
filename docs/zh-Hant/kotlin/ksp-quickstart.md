[//]: # (title: KSP 快速入門)

若要快速入門，您可以建立自己的處理器或取得一個[範例](https://github.com/google/ksp/tree/main/examples/playground)。

## 新增處理器

若要新增處理器，您需要包含 KSP Gradle 外掛程式並新增對處理器的依賴項：

1. 將 KSP Gradle 外掛程式 `com.google.devtools.ksp` 加入您的 `build.gradle(.kts)` 檔案：

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

2. 新增對處理器的依賴項。
此範例使用 [Dagger](https://dagger.dev/dev-guide/ksp.html)。請將其替換為您想要新增的處理器。

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

3. 執行 `./gradlew build`。您可以在 `build/generated/ksp` 目錄中找到生成的程式碼。

這是一個完整的範例：

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

## 建立您自己的處理器

1. 建立一個空的 Gradle 專案。
2. 在根專案中指定 Kotlin 外掛程式的 `%kspSupportedKotlinVersion%` 版本，以便在其他專案模組中使用：

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

3. 新增一個用於承載處理器的模組。

4. 在模組的建置腳本中，套用 Kotlin 外掛程式並將 KSP API 加入 `dependencies` 區塊。

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

5. 您需要實作 [`com.google.devtools.ksp.processing.SymbolProcessor`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt)
   和 [`com.google.devtools.ksp.processing.SymbolProcessorProvider`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt)。
   您對 `SymbolProcessorProvider` 的實作將作為服務載入，以實例化您實作的 `SymbolProcessor`。
   請注意以下事項：
    * 實作 [`SymbolProcessorProvider.create()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt)
      以建立一個 `SymbolProcessor`。透過 `SymbolProcessorProvider.create()` 的參數傳遞您的處理器所需的依賴項（例如 `CodeGenerator`、處理器選項）。
    * 您的主要邏輯應在 [`SymbolProcessor.process()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) 方法中。
    * 使用 `resolver.getSymbolsWithAnnotation()` 取得您想要處理的符號，並提供註解的完整限定名稱。
    * KSP 的常見使用案例是實作一個自訂訪客（介面 `com.google.devtools.ksp.symbol.KSVisitor`）來操作符號。一個簡單的範本訪客是 `com.google.devtools.ksp.symbol.KSDefaultVisitor`。
    * 有關 `SymbolProcessorProvider` 和 `SymbolProcessor` 介面的範例實作，請參閱範例專案中的以下檔案。
        * `src/main/kotlin/BuilderProcessor.kt`
        * `src/main/kotlin/TestProcessor.kt`
    * 撰寫您自己的處理器後，透過在 `src/main/resources/META-INF/services/com.google.devtools.ksp.processing.SymbolProcessorProvider` 中包含其完整限定名稱，將您的處理器提供者註冊到套件中。

## 在專案中使用您自己的處理器

1. 建立另一個模組，其中包含您想要試用處理器的工作負載。

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

2. 在模組的建置腳本中，以指定版本套用 `com.google.devtools.ksp` 外掛程式，並將您的處理器新增到依賴項清單中。

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

3. 執行 `./gradlew build`。您可以在 `build/generated/ksp` 下找到生成的程式碼。

這是一個將 KSP 外掛程式套用至工作負載的範例建置腳本：

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

## 將選項傳遞給處理器

在 Gradle 建置腳本中指定 `SymbolProcessorEnvironment.options` 中的處理器選項：

```none
ksp {
    arg("option1", "value1")
    arg("option2", "value2")
    ...
}
```

## 讓 IDE 識別生成的程式碼

> 從 KSP 1.8.0-1.0.9 版開始，生成的原始碼檔案會自動註冊。
> 如果您使用的是 KSP 1.0.9 或更新版本，並且不需要讓 IDE 識別生成的資源，請隨意跳過本節。
>
{style="note"}

預設情況下，IntelliJ IDEA 或其他 IDE 不了解生成的程式碼。因此，它會將對生成的符號的引用標記為無法解析。為了讓 IDE 能夠解析生成的符號，請將以下路徑標記為生成的原始碼根目錄：

```text
build/generated/ksp/main/kotlin/
build/generated/ksp/main/java/
```

如果您的 IDE 支援資源目錄，也請標記以下目錄：

```text
build/generated/ksp/main/resources/
```

在您的 KSP 消費者模組的建置腳本中設定這些目錄也可能是必要的：

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

如果您在 Gradle 外掛程式中使用 IntelliJ IDEA 和 KSP，則上述程式碼片段將產生以下警告：
```text
Execution optimizations have been disabled for task ':publishPluginJar' to ensure correctness due to the following reasons:
Gradle detected a problem with the following location: '../build/generated/ksp/main/kotlin'. 
Reason: Task ':publishPluginJar' uses this output of task ':kspKotlin' without declaring an explicit or implicit dependency.
```

在這種情況下，請改用以下腳本：

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