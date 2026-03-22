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
   <build>
       <plugins>
           <plugin>
               <groupId>org.jetbrains.kotlin</groupId>
               <artifactId>kotlin-maven-plugin</artifactId>
               <version>${kotlin.version}</version>
           </plugin>
       </plugins>
   </build>
   ```

3. <p id="extension">(任意) プロジェクトの設定を簡略化するために、<code>extensions</code>オプションを有効にすることもできます。
   これを行うには、`pom.xml`ファイルのKotlin Mavenプラグインセクションを更新します。</p>

   ```xml
   <plugins>
       <plugin>
           <groupId>org.jetbrains.kotlin</groupId>
           <artifactId>kotlin-maven-plugin</artifactId>
           <version>${kotlin.version}</version>
           <extensions>true</extensions> <!-- この拡張を追加 -->
       </plugin>
   </plugins>
   ```

   Kotlin Mavenプラグインの`extensions`オプションは、以下を自動的に行います：

   * `src/main/kotlin`および`src/test/kotlin`ディレクトリが存在し、プラグイン設定で指定されていない場合に、それらをソースルートとして登録します。
   * [`kotlin-stdlib`への依存関係](#dependency-on-the-standard-library)がまだ定義されていない場合に、それを追加します。

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

Kotlinには、アプリケーションで使用できる広範な標準ライブラリがあります。標準ライブラリへの依存関係を手動で追加するか、[`extensions`オプション](#extension)を有効にして、不足している場合に自動的に設定されるようにすることができます。

#### 手動設定

Kotlinの標準ライブラリをプロジェクトに手動で追加するには、`pom.xml`ファイルの`dependencies`セクションを次のように更新します。

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

#### 自動設定

Kotlin Mavenプラグインが提供する[`extensions`オプション](#extension)を使用することで、手動設定を回避できます。これにより、新しいKotlin Mavenプロジェクトを作成する場合や、既存のJava MavenプロジェクトにKotlinを導入する場合など、プロジェクトで`kotlin-stdlib`の依存関係が定義されていない場合に自動的に追加されます。

標準ライブラリの自動追加をオプトアウト（無効化）することも可能です。その場合は、`<properties>`セクションに以下を追加します。

```xml
<project>
    <properties>
        <kotlin.smart.defaults.enabled>false</kotlin.smart.defaults.enabled>         
    </properties>
</project>
```

このプロパティは、ソースルートパスの登録を含む、すべての簡略化された設定機能を無効にすることに注意してください。

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