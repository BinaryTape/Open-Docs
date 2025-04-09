---
title: Lombokコンパイラープラグイン
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

:::note
Lombokコンパイラープラグインは[試験的](components-stability)です。
いつでも削除または変更される可能性があります。評価目的でのみ使用してください。
[YouTrack](https://youtrack.jetbrains.com/issue/KT-7112)でフィードバックをお待ちしております。

Kotlin Lombokコンパイラープラグインを使用すると、同じ混合Java/Kotlinモジュール内のKotlinコードでJavaのLombok宣言を生成および使用できます。
別のモジュールからそのような宣言を呼び出す場合、そのモジュールのコンパイルにこのプラグインを使用する必要はありません。

Lombokコンパイラープラグインは[Lombok](https://projectlombok.org/)を置き換えることはできませんが、Lombokが混合Java/Kotlinモジュールで動作するのに役立ちます。
したがって、このプラグインを使用する場合でも、通常どおりLombokを構成する必要があります。
[Lombokコンパイラープラグインの構成方法](#using-the-lombok-configuration-file)の詳細をご覧ください。

## サポートされているアノテーション

このプラグインは、次のアノテーションをサポートしています。
* `@Getter`、`@Setter`
* `@Builder`、`@SuperBuilder`
* `@NoArgsConstructor`、`@RequiredArgsConstructor`、および`@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

このプラグインについては継続的に取り組んでいます。詳細な現在の状態については、[Lombok compiler plugin's README](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok)をご覧ください。

現在、`@Tolerate`アノテーションをサポートする予定はありません。ただし、YouTrackの[@Tolerate issue](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate)に投票していただければ、検討することができます。

Kotlinコンパイラーは、KotlinコードでLombokアノテーションを使用しても無視します。

:::

## Gradle

`build.gradle(.kts)`ファイルで`kotlin-plugin-lombok` Gradleプラグインを適用します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("plugin.lombok") version "2.1.20"
    id("io.freefair.lombok") version "8.13"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id 'org.jetbrains.kotlin.plugin.lombok' version '2.1.20'
    id 'io.freefair.lombok' version '8.13'
}
```

</TabItem>
</Tabs>

[Lombokコンパイラープラグインの使用例を含むこのテストプロジェクト](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/nokapt)をご覧ください。

### Lombok構成ファイルの使用

[Lombok構成ファイル](https://projectlombok.org/features/configuration) `lombok.config`を使用する場合は、プラグインがファイルを見つけられるように、ファイルのパスを設定する必要があります。
パスはモジュールのディレクトリに対する相対パスである必要があります。
たとえば、次のコードを`build.gradle(.kts)`ファイルに追加します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinLombok {
    lombokConfigurationFile(file("lombok.config"))
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinLombok {
    lombokConfigurationFile file("lombok.config")
}
```

</TabItem>
</Tabs>

[Lombokコンパイラープラグインと`lombok.config`の使用例を含むこのテストプロジェクト](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/withconfig)をご覧ください。

## Maven

Lombokコンパイラープラグインを使用するには、プラグイン`lombok`を`compilerPlugins`セクションに追加し、依存関係`kotlin-maven-lombok`を`dependencies`セクションに追加します。
[Lombok構成ファイル](https://projectlombok.org/features/configuration) `lombok.config`を使用する場合は、`pluginOptions`でプラグインへのパスを指定します。次の行を`pom.xml`ファイルに追加します。

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <configuration>
        <compilerPlugins>
<plugin>lombok</plugin>
        </compilerPlugins>
<pluginOptions>
            <option>lombok:config=${project.basedir}/lombok.config</option>
        </pluginOptions>
    </configuration>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-lombok</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>1.18.20</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>
</plugin>
```

[Lombokコンパイラープラグインと`lombok.config`の使用例を含むこのテストプロジェクト](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/nokapt)をご覧ください。

## kaptでの使用

デフォルトでは、[kapt](kapt)コンパイラープラグインはすべてのアノテーションプロセッサーを実行し、javacによるアノテーション処理を無効にします。
[Lombok](https://projectlombok.org/)をkaptと一緒に実行するには、javacのアノテーションプロセッサーが動作するようにkaptを設定します。

Gradleを使用する場合は、オプションを`build.gradle(.kts)`ファイルに追加します。

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

Mavenでは、次の設定を使用してLombokをJavaのコンパイラーで起動します。

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.5.1</version>
    <configuration>
        <source>1.8</source>
        <target>1.8</target>
        <annotationProcessorPaths>
            <annotationProcessorPath>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>${lombok.version}</version>
            </annotationProcessorPath>
        </annotationProcessorPaths>
    </configuration>
</plugin>    
```

アノテーションプロセッサーがLombokによって生成されたコードに依存しない場合、Lombokコンパイラープラグインは[kapt](kapt)で正しく動作します。

kaptとLombokコンパイラープラグインの使用例のテストプロジェクトをご覧ください。
* [Gradle](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/lombokProject/yeskapt)を使用。
* [Maven](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/yeskapt)を使用

## コマンドラインコンパイラー

LombokコンパイラープラグインJARは、Kotlinコンパイラーのバイナリディストリビューションで利用できます。`Xplugin` kotlincオプションを使用して、JARファイルへのパスを指定することで、プラグインをアタッチできます。

```bash
-Xplugin=$KOTLIN_HOME/lib/lombok-compiler-plugin.jar
```

`lombok.config`ファイルを使用する場合は、`<PATH_TO_CONFIG_FILE>`を`lombok.config`へのパスに置き換えます。

```bash
# The plugin option format is: "-P plugin:<plugin id>:<key>=<value>". 
# Options can be repeated.

-P plugin:org.jetbrains.kotlin.lombok:config=<PATH_TO_CONFIG_FILE>
```