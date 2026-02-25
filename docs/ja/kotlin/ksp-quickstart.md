[//]: # (title: KSP クイックスタート)

手早く始めるには、独自のプロセッサーを作成するか、[サンプル](https://github.com/google/ksp/tree/main/examples/playground)を入手してください。

## プロセッサーの追加

プロセッサーを追加するには、KSP Gradle プラグインを含め、プロセッサーへの依存関係を追加する必要があります。

1. `build.gradle(.kts)` ファイルに KSP Gradle プラグイン `com.google.devtools.ksp` を追加します。

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

2. プロセッサーへの依存関係を追加します。
この例では [Dagger](https://dagger.dev/dev-guide/ksp.html) を使用しています。追加したいプロセッサーに置き換えてください。

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

以下は完全な例です。

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

## 独自のプロセッサーを作成する

1. 空の Gradle プロジェクトを作成します。
2. 他のプロジェクトモジュールで使用するために、ルートプロジェクトで Kotlin プラグインのバージョン `%kspSupportedKotlinVersion%` を指定します。

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

3. プロセッサーをホストするためのモジュールを追加します。

4. モジュールのビルドスクリプトで、Kotlin プラグインを適用し、`dependencies` ブロックに KSP API を追加します。

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

5. [`com.google.devtools.ksp.processing.SymbolProcessor`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) と [`com.google.devtools.ksp.processing.SymbolProcessorProvider`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt) を実装する必要があります。
   `SymbolProcessorProvider` の実装は、実装した `SymbolProcessor` をインスタンス化するためのサービスとしてロードされます。
   以下の点に注意してください。
    * `SymbolProcessor` を作成するために [`SymbolProcessorProvider.create()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt) を実装します。プロセッサーが必要とする依存関係（`CodeGenerator`、プロセッサーオプションなど）を `SymbolProcessorProvider.create()` のパラメータを通じて渡します。
    * メインのロジックは [`SymbolProcessor.process()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt) メソッドに記述する必要があります。
    * アノテーションの完全修飾名（fully-qualified name）を指定して、処理したいシンボルを取得するには `resolver.getSymbolsWithAnnotation()` を使用します。
    * KSP の一般的なユースケースは、シンボルを操作するためにカスタマイズされたビジター（インターフェース `com.google.devtools.ksp.symbol.KSVisitor`）を実装することです。シンプルなテンプレートビジターとして `com.google.devtools.ksp.symbol.KSDefaultVisitor` があります。
    * `SymbolProcessorProvider` と `SymbolProcessor` インターフェースの実装例については、サンプルプロジェクトの以下のファイルを参照してください。
        * `src/main/kotlin/BuilderProcessor.kt`
        * `src/main/kotlin/TestProcessor.kt`
    * 独自のプロセッサーを作成した後、その完全修飾名を `src/main/resources/META-INF/services/com.google.devtools.ksp.processing.SymbolProcessorProvider` に含めることで、プロセッサープロバイダーをパッケージに登録します。

## プロジェクトで独自のプロセッサーを使用する

1. プロセッサーを試したいワークロードを含む別のモジュールを作成します。

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

2. モジュールのビルドスクリプトで、指定されたバージョンの `com.google.devtools.ksp` プラグインを適用し、依存関係のリストに独自のプロセッサーを追加します。

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

3. `./gradlew build` を実行します。生成されたコードは `build/generated/ksp` の下にあります。

ワークロードに KSP プラグインを適用するためのサンプルビルドスクリプトは以下の通りです。

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

## プロセッサーにオプションを渡す

`SymbolProcessorEnvironment.options` のプロセッサーオプションは、Gradle ビルドスクリプトで指定します。

```none
ksp {
    arg("option1", "value1")
    arg("option2", "value2")
    ...
}
```

## IDE に生成されたコードを認識させる

> KSP 1.8.0-1.0.9 以降、生成されたソースファイルは自動的に登録されます。
> KSP 1.0.9 以降を使用していて、生成されたリソースを IDE に認識させる必要がない場合は、このセクションをスキップしてください。
>
{style="note"}

デフォルトでは、IntelliJ IDEA やその他の IDE は生成されたコードを認識しません。そのため、生成されたシンボルへの参照が解決不能（unresolvable）としてマークされます。IDE が生成されたシンボルを推論できるようにするには、以下のパスを生成されたソースルートとしてマークします。

```text
build/generated/ksp/main/kotlin/
build/generated/ksp/main/java/
```

IDE がリソースディレクトリをサポートしている場合は、以下もマークしてください。

```text
build/generated/ksp/main/resources/
```

KSP コンシューマーモジュールのビルドスクリプトで、これらのディレクトリを構成する必要がある場合もあります。

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

IntelliJ IDEA と Gradle プラグインの KSP を使用している場合、上記のスニペットは次の警告を表示します。
```text
Execution optimizations have been disabled for task ':publishPluginJar' to ensure correctness due to the following reasons:
Gradle detected a problem with the following location: '../build/generated/ksp/main/kotlin'. 
Reason: Task ':publishPluginJar' uses this output of task ':kspKotlin' without declaring an explicit or implicit dependency.
```

この場合は、代わりに以下のスクリプトを使用してください。

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