[//]: # (title: Lombokコンパイラプラグイン)

> Lombokコンパイラプラグインは[実験的](components-stability.md)です。
> これはいつでも廃止または変更される可能性があります。評価目的でのみ使用してください。
> これに関するフィードバックを[YouTrack](https://youtrack.jetbrains.com/issue/KT-7112)でお寄せいただけると幸いです。
>
{style="warning"}

Kotlin Lombokコンパイラプラグインを使用すると、同じJava/Kotlin混在モジュール内でKotlinコードによるJavaのLombok宣言の生成と使用が可能になります。
別のモジュールからそのような宣言を呼び出す場合、そのモジュールのコンパイルにこのプラグインを使用する必要はありません。

Lombokコンパイラプラグインは[Lombok](https://projectlombok.org/)を置き換えることはできませんが、LombokがJava/Kotlin混在モジュールで動作するのを助けます。
したがって、このプラグインを使用する場合でも、通常通りLombokを設定する必要があります。
[Lombokコンパイラプラグインの設定方法](#using-the-lombok-configuration-file)について詳しくはこちらをご覧ください。

## サポートされているアノテーション

このプラグインは次のアノテーションをサポートしています。
* `@Getter`, `@Setter`
* `@Builder`, `@SuperBuilder`
* `@NoArgsConstructor`, `@RequiredArgsConstructor`, and `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

私たちはこのプラグインの開発を継続しています。詳細な現在の状態については、[LombokコンパイラプラグインのREADME](https://github.com/JetBrains/kotlin/tree/master/plugins/lombok)をご覧ください。

現在、`@Tolerate`アノテーションをサポートする予定はありません。しかし、YouTrackで[@Tolerateに関する問題](https://youtrack.jetbrains.com/issue/KT-53564/Kotlin-Lombok-Support-Tolerate)に投票していただければ、検討することは可能です。

> Kotlinコンパイラは、KotlinコードでLombokアノテーションを使用しても無視します。
>
{style="note"}

## Gradle

`build.gradle(.kts)`ファイルで`kotlin-plugin-lombok` Gradleプラグインを適用します。

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

Lombokコンパイラプラグインの使用例を含む[このテストプロジェクト](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/nokapt)をご覧ください。

### Lombok設定ファイルの使用

[Lombok設定ファイル](https://projectlombok.org/features/configuration)である`lombok.config`を使用する場合、プラグインがそれを見つけられるようにファイルのパスを設定する必要があります。
パスはモジュールのディレクトリに対する相対パスでなければなりません。
例えば、`build.gradle(.kts)`ファイルに以下のコードを追加します。

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

Lombokコンパイラプラグインと`lombok.config`の使用例を含む[このテストプロジェクト](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_gradle/withconfig)をご覧ください。

## Maven

Lombokコンパイラプラグインを使用するには、`compilerPlugins`セクションにプラグイン`lombok`を、`dependencies`セクションに依存関係`kotlin-maven-lombok`を追加します。
[Lombok設定ファイル](https://projectlombok.org/features/configuration)である`lombok.config`を使用する場合、`pluginOptions`でプラグインにそのパスを提供します。以下の行を`pom.xml`ファイルに追加します。

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

Lombokコンパイラプラグインと`lombok.config`の使用例を示す[このテストプロジェクト](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/nokapt)をご覧ください。

## kaptとの使用

デフォルトでは、[kapt](kapt.md)コンパイラプラグインは全てのアノテーションプロセッサを実行し、javacによるアノテーション処理を無効にします。
[Lombok](https://projectlombok.org/)をkaptと共に実行するには、kaptがjavacのアノテーションプロセッサを動作させ続けるように設定します。

Gradleを使用している場合は、`build.gradle(.kts)`ファイルに以下のオプションを追加します。

```groovy
kapt {
    keepJavacAnnotationProcessors = true
}
```

Mavenでは、JavaコンパイラでLombokを起動するために以下の設定を使用します。

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

アノテーションプロセッサがLombokによって生成されたコードに依存しない場合、Lombokコンパイラプラグインは[kapt](kapt.md)と正しく連携して動作します。

kaptとLombokコンパイラプラグインの使用例を示すテストプロジェクトをご覧ください。
* [Gradle](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin-integration-tests/src/test/resources/testProject/lombokProject/yeskapt)を使用する。
* [Maven](https://github.com/kotlin-hands-on/kotlin-lombok-examples/tree/master/kotlin_lombok_maven/yeskapt)を使用する。

## コマンドラインコンパイラ

LombokコンパイラプラグインのJARは、Kotlinコンパイラのバイナリディストリビューションで利用できます。
そのJARファイルへのパスを`Xplugin` kotlincオプションを使用して提供することで、プラグインをアタッチできます。

```bash
-Xplugin=$KOTLIN_HOME/lib/lombok-compiler-plugin.jar
```

もし`lombok.config`ファイルを使用したい場合は、`<PATH_TO_CONFIG_FILE>`をあなたの`lombok.config`へのパスに置き換えてください。

```bash
# プラグインオプションの形式は「-P plugin:<プラグインID>:<キー>=<値>」です。オプションは複数指定できます。

-P plugin:org.jetbrains.kotlin.lombok:config=<PATH_TO_CONFIG_FILE>
```