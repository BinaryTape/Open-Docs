[//]: # (title: Maven プロジェクトでのリポジトリと依存関係の設定)

Kotlin Maven プロジェクトでは、デフォルトの Maven Central リポジトリ以外のアーティファクトの検索場所を構成したり、プロジェクトが依存するライブラリを定義したりできます。

## リポジトリの宣言

デフォルトでは、すべての Maven プロジェクトで `mavenCentral` リポジトリが利用可能です。他のリポジトリのアーティファクトにアクセスするには、`<repositories>` セクションでリポジトリ名にカスタム ID とその URL を指定します。

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> Gradle プロジェクトでリポジトリとして `mavenLocal()` を宣言している場合、Gradle プロジェクトと Maven プロジェクトを切り替える際に問題が発生する可能性があります。詳細については、[リポジトリの宣言](gradle-configure-project.md#declare-repositories)を参照してください。
>
{style="note"}

一般に、ライブラリへの依存関係を追加するには、`<dependencies>` セクションに新しい `<dependency>` エントリを宣言する必要があります。

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-serialization-json</artifactId>
        <version>%serializationVersion%</version>
    </dependency>
</dependencies>
```

## 依存関係の設定

### 標準ライブラリへの依存関係

Kotlin には、アプリケーションで使用できる広範な標準ライブラリがあります。標準ライブラリの依存関係を手動で追加するか、`<extensions>` オプションを有効にして、不足している場合に自動的にセットアップされるように構成できます。

#### 自動セットアップ

Kotlin Maven プラグインが提供する [`<extensions>` オプション](maven-configure-project.md#automatic-configuration)を使用すると、手動構成を回避できます。プロジェクトで定義されていない場合、`kotlin-stdlib` の依存関係が自動的に追加されます。たとえば、新しい Kotlin Maven プロジェクトを作成する場合や、既存の Java Maven プロジェクトに Kotlin を導入する場合などです。

すでに別のバージョンなどで `kotlin-stdlib` の依存関係を宣言している場合、`<extensions>` を指定した Kotlin Maven プラグインはそれを上書きしません。

標準ライブラリの自動追加を無効（オプトアウト）にすることもできます。その場合は、`<properties>` セクションに以下を追加します。

```xml
<project>
    <properties>
        <kotlin.smart.defaults.enabled>false</kotlin.smart.defaults.enabled>         
    </properties>
</project>
```

> このプロパティは、標準ライブラリの自動追加だけでなく、ソースルートパスの登録も無効にします。他の `<extensions>` 機能には影響しません。
>
{style="note"}

#### 手動構成

プロジェクトに Kotlin の標準ライブラリを手動で追加するには、`pom.xml` ファイルの `dependencies` セクションを次のように更新します。

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <!-- <properties/> で指定された kotlin.version を使用します: --> 
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> 1.8 より前の Kotlin バージョンで JDK 7 または 8 をターゲットにしている場合：
> * 1.8 未満の場合は、それぞれ `kotlin-stdlib-jdk7` または `kotlin-stdlib-jdk8` を使用してください。
> * 1.2 未満の場合は、それぞれ `kotlin-stdlib-jre7` または `kotlin-stdlib-jre8` を使用してください。
>
{style="note"}

### テストライブラリへの依存関係

プロジェクトで [Kotlin リフレクション](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/)やテストフレームワークを使用する場合は、関連する依存関係を追加します。
リフレクションライブラリには `kotlin-reflect` を、テストライブラリには `kotlin-test` および `kotlin-test-junit5` を使用します。

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-reflect</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-test-junit5</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### kotlinx ライブラリへの依存関係

kotlinx ライブラリの場合、ベースのアーティファクト名、または `-jvm` サフィックスが付いた名前のいずれかを追加できます。[klibs.io](https://klibs.io/) にあるライブラリの README ファイルを参照してください。

たとえば、[`kotlinx.coroutines`](https://kotlinlang.org/api/kotlinx.coroutines/) ライブラリへの依存関係を追加するには、次のようにします。

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-coroutines-core</artifactId>
        <version>%coroutinesVersion%</version>
    </dependency>
</dependencies>
```

[`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) ライブラリへの依存関係を追加するには、次のようにします。

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-datetime-jvm</artifactId>
        <version>%dateTimeVersion%</version>
    </dependency>
</dependencies>
```

### BOM 依存関係メカニズムの使用

Kotlin の [Bill of Materials (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms) を使用するには、[`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom) への依存関係を追加します。

```xml
<dependencyManagement>
    <dependencies>  
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-bom</artifactId>
            <version>%kotlinVersion%</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## 次のステップ

[Kotlin コンパイラの構成](maven-kotlin-compiler.md)