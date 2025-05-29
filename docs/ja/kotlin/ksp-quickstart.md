[//]: # (title: KSPクイックスタート)

クイックスタートとして、独自のプロセッサを作成するか、[サンプル](https://github.com/google/ksp/tree/main/examples/playground)を入手できます。

## プロセッサの追加

プロセッサを追加するには、KSP Gradleプラグインを含め、プロセッサへの依存関係を追加する必要があります。

1. KSP Gradleプラグイン `com.google.devtools.ksp` を `build.gradle(.kts)` ファイルに追加します。

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

2. プロセッサへの依存関係を追加します。
この例では[Dagger](https://dagger.dev/dev-guide/ksp.html)を使用しています。追加したいプロセッサに置き換えてください。

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

3. `./gradlew build` を実行します。生成されたコードは `build/generated/ksp` ディレクトリで見つけることができます。

完全な例を以下に示します。

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

## 独自のプロセッサを作成する

1. 空のGradleプロジェクトを作成します。
2. ルートプロジェクトで、他のプロジェクトモジュールで使用するために、Kotlinプラグインのバージョン `%kspSupportedKotlinVersion%` を指定します。

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

3. プロセッサをホストするためのモジュールを追加します。

4. モジュールのビルドスクリプトで、Kotlinプラグインを適用し、KSP APIを `dependencies` ブロックに追加します。

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

5. [`com.google.devtools.ksp.processing.SymbolProcessor`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt)
   と [`com.google.devtools.ksp.processing.SymbolProcessorProvider`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt) を実装する必要があります。
   `SymbolProcessorProvider` の実装は、実装した `SymbolProcessor` をインスタンス化するためのサービスとしてロードされます。
   以下に注意してください：
    * `SymbolProcessor` を作成するには、[`SymbolProcessorProvider.create()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt)
      を実装します。プロセッサが必要とする依存関係（`CodeGenerator`、プロセッサオプションなど）を
      `SymbolProcessorProvider.create()` のパラメータを通じて渡します。
    * メインロジックは [`SymbolProcessor.process()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) メソッド内に置く必要があります。
    * アノテーションの完全修飾名が与えられたときに、処理したいシンボルを取得するには
      `resolver.getSymbolsWithAnnotation()` を使用します。
    * KSPの一般的なユースケースは、シンボルを操作するためにカスタマイズされたビジタ（インターフェース `com.google.devtools.ksp.symbol.KSVisitor`）を実装することです。
      シンプルなテンプレートビジタは `com.google.devtools.ksp.symbol.KSDefaultVisitor` です。
    * `SymbolProcessorProvider` インターフェースと `SymbolProcessor` インターフェースのサンプル実装については、
      サンプルプロジェクトの以下のファイルを参照してください。
        * `src/main/kotlin/BuilderProcessor.kt`
        * `src/main/kotlin/TestProcessor.kt`
    * 独自のプロセッサを記述した後、そのプロセッサプロバイダの完全修飾名を
      `src/main/resources/META-INF/services/com.google.devtools.ksp.processing.SymbolProcessorProvider` に含めることで
      パッケージに登録します。

## プロジェクトで独自のプロセッサを使用する

1. プロセッサを試したいワークロードを含む別のモジュールを作成します。

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

2. モジュールのビルドスクリプトで、`com.google.devtools.ksp` プラグインを指定したバージョンで適用し、
   プロセッサを依存関係のリストに追加します。

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

3. `./gradlew build` を実行します。生成されたコードは
   `build/generated/ksp` の下にあります。

ワークロードにKSPプラグインを適用するサンプルビルドスクリプトは以下の通りです。

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

## プロセッサへのオプションの受け渡し

`SymbolProcessorEnvironment.options` のプロセッサオプションは、Gradleビルドスクリプトで指定されます。

```none
ksp {
    arg("option1", "value1")
    arg("option2", "value2")
    ...
}
```

## IDEに生成されたコードを認識させる

> 生成されたソースファイルはKSP 1.8.0-1.0.9以降、自動的に登録されます。
> KSP 1.0.9以降を使用しており、生成されたリソースをIDEに認識させる必要がない場合は、
> このセクションをスキップしても問題ありません。
>
{style="note"}

デフォルトでは、IntelliJ IDEAやその他のIDEは生成されたコードについて認識しません。そのため、生成されたシンボルへの参照を解決できないものとしてマークします。IDEが生成されたシンボルを推論できるようにするには、以下のパスを生成されたソースルートとしてマークします。

```text
build/generated/ksp/main/kotlin/
build/generated/ksp/main/java/
```

IDEがリソースディレクトリをサポートしている場合は、以下のディレクトリもマークしてください。

```text
build/generated/ksp/main/resources/
```

これらのディレクトリをKSPコンシューマーモジュールのビルドスクリプトで設定する必要がある場合もあります。

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

IntelliJ IDEAとGradleプラグインでKSPを使用している場合、上記のコードスニペットは以下の警告を表示します。
```text
Execution optimizations have been disabled for task ':publishPluginJar' to ensure correctness due to the following reasons:
Gradle detected a problem with the following location: '../build/generated/ksp/main/kotlin'. 
Reason: Task ':publishPluginJar' uses this output of task ':kspKotlin' without declaring an explicit or implicit dependency.
```

この場合、代わりに以下のスクリプトを使用してください。

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