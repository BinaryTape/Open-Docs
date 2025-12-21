[//]: # (title: Lombokコンパイラープラグイン)
<primary-label ref="alpha"/>

Kotlin Lombokコンパイラープラグインを使用すると、同じJava/Kotlin混在モジュール内でKotlinコードによるJavaのLombok宣言の生成と使用が可能になります。
別のモジュールからそのような宣言を呼び出す場合、そのモジュールのコンパイルにはこのプラグインを使用する必要はありません。

Lombokコンパイラープラグインは[Lombok](https://projectlombok.org/)を置き換えるものではありませんが、Java/Kotlin混在モジュールでLombokが動作するのを助けます。
したがって、このプラグインを使用する場合でも、通常通りLombokを設定する必要があります。
[Lombokコンパイラープラグインの設定方法](#using-the-lombok-configuration-file)について詳しく学びましょう。

## サポートされている注釈

プラグインは以下の注釈をサポートしています。
* `@Getter`, `@Setter`
* `@Builder`, `@SuperBuilder`
* `@NoArgsConstructor`, `@RequiredArgsConstructor`, および `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

私たちはこのプラグインの開発を継続しています。詳細な現状については、[LombokコンパイラープラグインのREADME](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok)を参照してください。

現在、`@Tolerate`注釈をサポートする予定はありません。ただし、YouTrackの[@Tolerate issue](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate)に投票していただければ、検討することができます。

> Kotlinコンパイラーは、KotlinコードでLombok注釈を使用した場合、それらを無視します。
>
{style="note"}

## Gradle

`kotlin-plugin-lombok` Gradleプラグインを`build.gradle(.kts)`ファイルに適用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.lombok") version "%kotlinVersion%"
    id("io.freefair.lombok") version "%lombokVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id 'org.jetbrains.kotlin.plugin.lombok' version '%kotlinVersion%'
    id 'io.freefair.lombok' version '%lombokVersion%'
}
```

</tab>
</tabs>

Lombokコンパイラープラグインの使用例を含む[テストプロジェクト](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/nokapt)を参照してください。

### Lombok設定ファイルの使用

[Lombok設定ファイル](https://projectlombok.org/features/configuration) `lombok.config`を使用する場合、プラグインがそれを見つけられるようにファイルのパスを設定する必要があります。
パスはモジュールのディレクトリからの相対パスである必要があります。
例えば、次のコードを`build.gradle(.kts)`ファイルに追加します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlinLombok {
    lombokConfigurationFile(file("lombok.config"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlinLombok {
    lombokConfigurationFile file("lombok.config")
}
```

</tab>
</tabs>

Lombokコンパイラープラグインと`lombok.config`の使用例を含む[テストプロジェクト](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/withconfig)を参照してください。

## Maven

Lombokコンパイラープラグインを使用するには、プラグイン`lombok`を`compilerPlugins`セクションに、依存関係`kotlin-maven-lombok`を`dependencies`セクションに追加します。
[Lombok設定ファイル](https://projectlombok.org/features/configuration) `lombok.config`を使用する場合、`pluginOptions`でプラグインにそのパスを提供します。次の行を`pom.xml`ファイルに追加します。

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

Lombokコンパイラープラグインと`lombok.config`の使用例の[テストプロジェクト](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/nokapt)を参照してください。

## kaptとの使用

デフォルトでは、[kapt](kapt.md)コンパイラープラグインはすべてのアノテーションプロセッサーを実行し、javacによるアノテーション処理を無効にします。
kaptと一緒に[Lombok](https://projectlombok.org/)を実行するには、javacのアノテーションプロセッサーが動作し続けるようにkaptを設定します。

Gradleを使用している場合、`build.gradle(.kts)`ファイルにオプションを追加します。

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

Mavenでは、JavaのコンパイラーでLombokを起動するために、次の設定を使用します。

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

Lombokコンパイラープラグインは、アノテーションプロセッサーがLombokによって生成されたコードに依存しない場合、[kapt](kapt.md)と正しく動作します。

kaptとLombokコンパイラープラグインの使用例のテストプロジェクトを参照してください。
* [Gradle](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/lombokProject/yeskapt)を使用する場合。
* [Maven](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/yeskapt)を使用する場合。

## コマンドラインコンパイラー

LombokコンパイラープラグインのJARは、Kotlinコンパイラーのバイナリ配布に含まれています。`Xplugin` kotlincオプションを使用して、JARファイルへのパスを指定することでプラグインをアタッチできます。

```bash
-Xplugin=$KOTLIN_HOME/lib/lombok-compiler-plugin.jar
```

`lombok.config`ファイルを使用したい場合は、`<PATH_TO_CONFIG_FILE>`を`lombok.config`へのパスに置き換えてください。

```bash
# プラグインオプションの形式は「-P plugin:<plugin id>:<キー>=<値>」です。
# オプションは複数指定できます。

-P plugin:org.jetbrains.kotlin.lombok:config=<PATH_TO_CONFIG_FILE>