[//]: # (title: KSP クイックスタート)

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

3. `./gradlew build` を実行します。生成されたコードは `build/generated/ksp` ディレクトリにあります。

完全な例を次に示します。

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
2. 他のプロジェクトモジュールで使用するために、ルートプロジェクトでKotlinプラグインのバージョン `%kspSupportedKotlinVersion%` を指定します。

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

5. [`com.google.devtools.ksp.processing.SymbolProcessor`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) および [`com.google.devtools.ksp.processing.SymbolProcessorProvider`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt) を実装する必要があります。
   あなたが実装する `SymbolProcessorProvider` の実装は、実装した `SymbolProcessor` をインスタンス化するためのサービスとしてロードされます。以下に注意してください。
    * `SymbolProcessor` を作成するために [`SymbolProcessorProvider.create()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt) を実装します。プロセッサが必要とする依存関係（`CodeGenerator`、プロセッサオプションなど）を `SymbolProcessorProvider.create()` のパラメータを通じて渡します。
    * メインロジックは [`SymbolProcessor.process()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) メソッドに記述する必要があります。
    * アノテーションの完全修飾名を指定して、`resolver.getSymbolsWithAnnotation()` を使用して処理したいシンボルを取得します。
    * KSPの一般的なユースケースは、シンボルを操作するためのカスタマイズされたビジター（インターフェース `com.google.devtools.ksp.symbol.KSVisitor`）を実装することです。シンプルなテンプレートビジターは `com.google.devtools.ksp.symbol.KSDefaultVisitor` です。
    * `SymbolProcessorProvider` および `SymbolProcessor` インターフェースのサンプル実装については、サンプルプロジェクト内の以下のファイルを参照してください。
        * `src/main/kotlin/BuilderProcessor.kt`
        * `src/main/kotlin/TestProcessor.kt`
    * 独自のプロセッサを記述したら、`src/main/resources/META-INF/services/com.google.devtools.ksp.processing.SymbolProcessorProvider` にその完全修飾名を含めることによって、プロセッサプロバイダーをパッケージに登録します。

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

2. モジュールのビルドスクリプトで、指定されたバージョンで `com.google.devtools.ksp` プラグインを適用し、プロセッサを依存関係のリストに追加します。

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

3. `./gradlew build` を実行します。生成されたコードは `build/generated/ksp` にあります。

ワークロードにKSPプラグインを適用するサンプルのビルドスクリプトを次に示します。

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

## プロセッサにオプションを渡す

`SymbolProcessorEnvironment.options` 内のプロセッサオプションは、Gradleビルドスクリプトで指定します。

```none
ksp {
    arg("option1", "value1")
    arg("option2", "value2")
    ...
}
```

## IDEに生成されたコードを認識させる

> KSP 1.8.0-1.0.9 以降、生成されたソースファイルは自動的に登録されます。
> KSP 1.0.9 以降を使用しており、生成されたリソースをIDEに認識させる必要がない場合は、このセクションをスキップしても問題ありません。
>
{style="note"}

デフォルトでは、IntelliJ IDEAなどのIDEは生成されたコードを認識しません。そのため、生成されたシンボルへの参照が解決不能としてマークされます。IDEが生成されたシンボルを認識できるようにするには、以下のパスを生成されたソースルートとしてマークします。

```text
build/generated/ksp/main/kotlin/
build/generated/ksp/main/java/
```

IDEがリソースディレクトリをサポートしている場合、以下もマークします。

```text
build/generated/ksp/main/resources/
```

KSPコンシューマーモジュールのビルドスクリプトでこれらのディレクトリを構成する必要がある場合もあります。

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

IntelliJ IDEAとKSPをGradleプラグインで使用している場合、上記のスニペットでは以下の警告が表示されます。
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