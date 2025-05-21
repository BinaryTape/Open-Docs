---
title: "KSP クイックスタート"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

手早く始めるには、独自のプロセッサを作成するか、[サンプル](https://github.com/google/ksp/tree/main/examples/playground)を入手できます。

## プロセッサの追加

プロセッサを追加するには、KSP Gradle Pluginを含め、プロセッサへの依存関係を追加する必要があります。

1. KSP Gradle Plugin `com.google.devtools.ksp`を`build.gradle(.kts)`ファイルに追加します。

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

2. プロセッサへの依存関係を追加します。
この例では[Dagger](https://dagger.dev/dev-guide/ksp.html)を使用します。追加するプロセッサに置き換えてください。

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

3. `./gradlew build`を実行します。生成されたコードは`build/generated/ksp`ディレクトリにあります。

以下に完全な例を示します。

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

## 独自のプロセッサの作成

1. 空のgradleプロジェクトを作成します。
2. 他のプロジェクトモジュールで使用するために、ルートプロジェクトでKotlinプラグインのバージョン`2.1.10`を指定します。

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

3. プロセッサをホストするためのモジュールを追加します。

4. モジュールのビルドスクリプトで、Kotlinプラグインを適用し、KSP APIを`dependencies`ブロックに追加します。

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

5. [`com.google.devtools.ksp.processing.SymbolProcessor`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt)と[`com.google.devtools.ksp.processing.SymbolProcessorProvider`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt)を実装する必要があります。
   `SymbolProcessorProvider`の実装は、`SymbolProcessor`をインスタンス化するサービスとしてロードされます。
   以下の点に注意してください。
    * [`SymbolProcessorProvider.create()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt)を実装
      して`SymbolProcessor`を作成します。プロセッサに必要な依存関係（`CodeGenerator`、プロセッサオプションなど）を
      `SymbolProcessorProvider.create()`のパラメータを介して渡します。
    * メインロジックは[`SymbolProcessor.process()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt)メソッドに記述する必要があります。
    * アノテーションの完全修飾名が与えられた場合、`resolver.getSymbolsWithAnnotation()`を使用して処理するシンボルを取得します。
    * KSPの一般的なユースケースは、シンボルを操作するためのカスタマイズされたvisitor（インターフェース`com.google.devtools.ksp.symbol.KSVisitor`）を実装することです。シンプルなテンプレートvisitorは`com.google.devtools.ksp.symbol.KSDefaultVisitor`です。
    * `SymbolProcessorProvider`インターフェースと`SymbolProcessor`インターフェースのサンプル実装については、サンプルプロジェクトの次のファイルを参照してください。
        * `src/main/kotlin/BuilderProcessor.kt`
        * `src/main/kotlin/TestProcessor.kt`
    * 独自のプロセッサを作成した後、その完全修飾名を`src/main/resources/META-INF/services/com.google.devtools.ksp.processing.SymbolProcessorProvider`に含めることで、パッケージにプロセッサプロバイダを登録します。

## プロジェクトで独自のプロセッサを使用する

1. プロセッサを試したいワークロードを含む別のモジュールを作成します。

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

2. モジュールのビルドスクリプトで、指定されたバージョンの`com.google.devtools.ksp`プラグインを適用し、
   プロセッサを依存関係のリストに追加します。

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

3. `./gradlew build`を実行します。生成されたコードは`build/generated/ksp`にあります。

以下に、KSPプラグインをワークロードに適用するサンプルビルドスクリプトを示します。

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

## プロセッサにオプションを渡す

`SymbolProcessorEnvironment.options`のプロセッサオプションは、gradleビルドスクリプトで指定されます。

```none
ksp {
    arg("option1", "value1")
    arg("option2", "value2")
    ...
}
```

## IDEに生成されたコードを認識させる

:::note
生成されたソースファイルは、KSP 1.8.0-1.0.9以降、自動的に登録されます。
KSP 1.0.9以降を使用しており、生成されたリソースをIDEに認識させる必要がない場合は、
このセクションをスキップしてください。

:::

デフォルトでは、IntelliJ IDEAやその他のIDEは、生成されたコードを認識しません。そのため、生成された
シンボルへの参照は解決不能としてマークされます。IDEが生成されたシンボルについて推論できるようにするには、
次のパスを生成されたソースルートとしてマークします。

```text
build/generated/ksp/main/kotlin/
build/generated/ksp/main/java/
```

IDEがリソースディレクトリをサポートしている場合は、次のディレクトリもマークします。

```text
build/generated/ksp/main/resources/
```

これらのディレクトリをKSPコンシューマーモジュールのビルドスクリプトで構成する必要がある場合もあります。

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

IntelliJ IDEAおよびGradleプラグインでKSPを使用している場合、上記のスクリプトは次の警告を表示します。
```text
Execution optimizations have been disabled for task ':publishPluginJar' to ensure correctness due to the following reasons:
Gradle detected a problem with the following location: '../build/generated/ksp/main/kotlin'. 
Reason: Task ':publishPluginJar' uses this output of task ':kspKotlin' without declaring an explicit or implicit dependency.
```

この場合は、代わりに次のスクリプトを使用します。

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