[//]: # (title: Mavenプロジェクトの設定)

Mavenを使用してKotlinプロジェクトをビルドするには、`pom.xml`ビルドファイルにKotlin Mavenプラグインを追加し、リポジトリを宣言し、プロジェクトの依存関係を設定する必要があります。

## プラグインの有効化と設定

`kotlin-maven-plugin`はKotlinのソースとモジュールをコンパイルします。現在、Maven v3のみがサポートされています。

Kotlin Mavenプラグインを適用するには、`pom.xml`ビルドファイルを次のように更新します。

1. `<properties>`セクションで、使用するKotlinのバージョンを`kotlin.version`プロパティに定義します。

   ```xml
   <properties>
       <kotlin.version>%kotlinVersion%</kotlin.version>
   </properties>
   ```

2. `<build><plugins>`セクションで、Kotlin Mavenプラグインを追加します。

   ```xml
   <plugins>
       <plugin>
           <artifactId>kotlin-maven-plugin</artifactId>
           <groupId>org.jetbrains.kotlin</groupId>
           <version>${kotlin.version}</version>
       </plugin>
   </plugins>
   ```

### JDK 17の使用

JDK 17を使用するには、`.mvn/jvm.config`ファイルに以下を追加します。

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## リポジトリの宣言

デフォルトでは、すべてのMavenプロジェクトで`mavenCentral`リポジトリが利用可能です。他のリポジトリのアーティファクトにアクセスするには、`<repositories>`セクションでリポジトリ名にカスタムIDとそのURLを指定します。

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> Gradleプロジェクトで`mavenLocal()`をリポジトリとして宣言している場合、GradleプロジェクトとMavenプロジェクトを切り替える際に問題が発生する可能性があります。詳細については、[リポジトリの宣言](gradle-configure-project.md#declare-repositories)を参照してください。
>
{style="note"}

## 依存関係の設定

ライブラリへの依存関係を追加するには、`<dependencies>`セクションに含めます。

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-serialization-json</artifactId>
        <version>%serializationVersion%</version>
    </dependency>
</dependencies>
```

### 標準ライブラリへの依存関係

Kotlinには、アプリケーションで使用できる広範な標準ライブラリがあります。プロジェクトで標準ライブラリを使用するには、`pom.xml`ファイルに以下の依存関係を追加します。

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <!-- <properties/> で指定された kotlin.version 
             プロパティを使用します: --> 
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> 以下より前のKotlinバージョンでJDK 7または8をターゲットにする場合：
> * 1.8未満の場合は、それぞれ`kotlin-stdlib-jdk7`または`kotlin-stdlib-jdk8`を使用してください。
> * 1.2未満の場合は、それぞれ`kotlin-stdlib-jre7`または`kotlin-stdlib-jre8`を使用してください。
>
{style="note"}

### テストライブラリへの依存関係

プロジェクトで[Kotlinリフレクション](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/)やテストフレームワークを使用する場合は、関連する依存関係を追加します。リフレクションライブラリには`kotlin-reflect`を、テストライブラリには`kotlin-test`および`kotlin-test-junit5`を使用します。

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

### kotlinxライブラリへの依存関係

kotlinxライブラリの場合は、ベースのアーティファクト名、または`-jvm`サフィックスが付いた名前を追加できます。[klibs.io](https://klibs.io/)にあるライブラリのREADMEファイルを参照してください。

例えば、[`kotlinx.coroutines`](https://kotlinlang.org/api/kotlinx.coroutines/)ライブラリへの依存関係を追加するには：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-coroutines-core</artifactId>
        <version>%coroutinesVersion%</version>
    </dependency>
</dependencies>
```

[`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/)ライブラリへの依存関係を追加するには：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-datetime-jvm</artifactId>
        <version>%dateTimeVersion%</version>
    </dependency>
</dependencies>
```

### BOM依存関係メカニズムの使用

Kotlinの[Bill of Materials (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)を使用するには、[`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom)への依存関係を追加します。

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

[Kotlin Mavenプロジェクトのコンパイルとパッケージ化](maven-compile-package.md)