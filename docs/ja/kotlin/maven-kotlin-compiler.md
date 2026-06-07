[//]: # (title: MavenプロジェクトのKotlinコンパイラの設定)

`kotlin-maven-plugin` を使用すると、Maven プロジェクトの Kotlin コンパイラを設定できます。
コンパイラオプションの指定、実行戦略の選択、および増分コンパイルの有効化が可能です。

## コンパイラオプションの指定

Kotlin Maven プラグインノードの `<configuration>` セクションの要素として、コンパイラの追加オプションや引数を指定できます。

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- ビルドへの実行の自動追加を有効にする場合 -->
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn> <!-- 警告を無効化 -->
        <args>
            <arg>-Xjsr305=strict</arg> <!-- JSR-305 アノテーションに対して厳密（strict）モードを有効化 -->
            ...
        </args>
    </configuration>
</plugin>
```

多くのオプションはプロパティを通じても設定可能です：

```xml
<project>
    <properties>
        <kotlin.compiler.languageVersion>%languageVersion%</kotlin.compiler.languageVersion>
    </properties>
</project>
```

以下の属性がサポートされています：

### JVM 固有の属性

| 名前 | プロパティ名 | 説明 | 設定可能な値 | デフォルト値 |
|-------------------|-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------|-----------------------------|
| `nowarn`          |                                   | 警告を生成しない | true, false                                             | false                       |
| `languageVersion` | `kotlin.compiler.languageVersion` | 指定されたバージョンの Kotlin とのソース互換性を提供 | "2.0", "2.1", "2.2", "2.3", "2.4", "2.5" (EXPERIMENTAL) |                             |
| `apiVersion`      | `kotlin.compiler.apiVersion`      | 同梱されているライブラリの指定されたバージョンからの宣言のみを使用可能にする | "2.0", "2.1", "2.2", "2.3", "2.4", "2.5" (EXPERIMENTAL) |                             |
| `sourceDirs`      |                                   | コンパイルするソースファイルが含まれるディレクトリ |                                                         | プロジェクトのソースルート |
| `compilerPlugins` |                                   | 有効にするコンパイラプラグイン |                                                         | []                          |
| `pluginOptions`   |                                   | コンパイラプラグインのオプション |                                                         | []                          |
| `args`            |                                   | 追加のコンパイラ引数 |                                                         | []                          |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`       | 生成される JVM バイトコードのターゲットバージョン。出力のバイトコードバージョンのみを制御し、コードが使用できる JDK API を制限しません。 | "1.8", "9", "10", ..., "26"                             | "%defaultJvmTargetVersion%" |
| `jdkRelease`      | `kotlin.compiler.jdkRelease`      | ターゲット JVM バージョン。バイトコードバージョンを制御し、利用可能な API を指定された JDK バージョンに制限することで、新しい API の誤用を防ぎます。Java の `--release` コンパイラオプションに相当します。 | "1.8", "9", "10", ..., "26"                             |                             |
| `jdkHome`         | `kotlin.compiler.jdkHome`         | デフォルトの `JAVA_HOME` の代わりに、指定された場所にあるカスタム JDK をクラスパスに含める |                                                         |                             |
| `jdkToolchain`    | `kotlin.compiler.jdkToolchain`    | ツールチェーンから使用する JDK バージョンを設定します。Kotlin コンパイルにのみ影響します。 |                                                         |                             |

## 実行戦略の選択

<snippet id="maven-configure-execution-strategy">

デフォルトでは、Maven は Kotlin デーモンコンパイラ実行戦略を使用します。「インプロセス（in process）」戦略に切り替えるには、`pom.xml` ファイルで以下のプロパティを設定します。

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

</snippet>

さまざまな戦略の詳細については、[コンパイラ実行戦略](compiler-execution-strategy.md)を参照してください。

## 増分コンパイルの有効化

ビルドを高速化するために、`kotlin.compiler.incremental` プロパティを追加して増分コンパイルを有効にできます。

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

または、`-Dkotlin.compiler.incremental=true` オプションを付けてビルドを実行します。

## 次のステップ

[プロジェクトをパッケージ化する](maven-compile-package.md)