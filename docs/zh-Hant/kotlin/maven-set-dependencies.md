[//]: # (title: 在 Maven 專案中設定存儲庫與相依性)

對於您的 Kotlin Maven 專案，您可以設定 Maven 除了預設的 Maven Central 存儲庫之外尋找構件的位置，並定義您的專案所依賴的程式庫。

## 宣告存儲庫 {id="declare-repositories"}

預設情況下，`mavenCentral` 存儲庫可用於所有 Maven 專案。若要存取其他存儲庫中的構件，請在 `<repositories>` 區塊中為存儲庫名稱指定自訂 ID 及其 URL：

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> 如果您在 Gradle 專案中將 `mavenLocal()` 宣告為存儲庫，在 Gradle 與 Maven 專案之間切換時可能會遇到問題。若要了解更多，請參閱 [宣告存儲庫](gradle-configure-project.md#declare-repositories)。
>
{style="note"}

一般來說，要新增對程式庫的相依性，您應該在 `<dependencies>` 區塊中宣告一個新的 `<dependency>` 項目：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-serialization-json</artifactId>
        <version>%serializationVersion%</version>
    </dependency>
</dependencies>
```

## 設定相依性 {id="set-dependencies"}

### 對標準程式庫的相依性 {id="dependency-on-the-standard-library"}

Kotlin 擁有廣泛的標準程式庫，您可以在應用程式中使用。您可以手動新增標準程式庫相依性，或者啟用 `<extensions>` 選項以在缺失時自動設定。

#### 自動設定 {id="automatic-setup"}

您可以使用 Kotlin Maven 外掛程式提供的 [`<extensions>` 選項](maven-configure-project.md#automatic-configuration) 來避免手動配置。如果專案中未定義，它會自動新增 `kotlin-stdlib` 相依性。例如，當您建立新的 Kotlin Maven 專案，或將 Kotlin 引入現有的 Java Maven 專案時。

如果您已經宣告了 `kotlin-stdlib` 相依性（例如使用不同的版本），則帶有 `<extensions>` 的 Kotlin Maven 外掛程式將不會覆寫它。

您也可以選擇退出自動新增標準程式庫。為此，請將以下內容新增至 `<properties>` 區塊：

```xml
<project>
    <properties>
        <kotlin.smart.defaults.enabled>false</kotlin.smart.defaults.enabled>         
    </properties>
</project>
```

> 此屬性不僅會停用自動新增標準程式庫，還會停用原始碼根路徑的註冊。其他 `<extensions>` 功能不受影響。
>
{style="note"}

#### 手動配置 {id="manual-configuration"}

若要手動將 Kotlin 的標準程式庫新增至您的專案，請使用以下內容更新 `pom.xml` 檔案中的 `dependencies` 區塊：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <!-- 使用 <properties/> 中指定的 kotlin.version： --> 
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> 如果您的目標是 JDK 7 或 8，且 Kotlin 版本早於：
> * 1.8，請分別使用 `kotlin-stdlib-jdk7` 或 `kotlin-stdlib-jdk8`。
> * 1.2，請分別使用 `kotlin-stdlib-jre7` 或 `kotlin-stdlib-jre8`。
>
{style="note"}

### 對測試程式庫的相依性 {id="dependencies-on-test-libraries"}

如果您的專案使用 [Kotlin 反射](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/) 或測試架構，請新增相關的相依性。
為反射程式庫使用 `kotlin-reflect`，並為測試程式庫使用 `kotlin-test` 和 `kotlin-test-junit5`：

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

### 對 kotlinx 程式庫的相依性 {id="dependency-on-a-kotlinx-library"}

對於 kotlinx 程式庫，您可以新增基礎構件名稱或帶有 `-jvm` 後綴的名稱。請參考 [klibs.io](https://klibs.io/) 上該程式庫的 README 檔案。

例如，要新增對 [`kotlinx.coroutines`](https://kotlinlang.org/api/kotlinx.coroutines/) 程式庫的相依性：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-coroutines-core</artifactId>
        <version>%coroutinesVersion%</version>
    </dependency>
</dependencies>
```

若要新增對 [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) 程式庫的相依性：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-datetime-jvm</artifactId>
        <version>%dateTimeVersion%</version>
    </dependency>
</dependencies>
```

## 使用 BOM 管理相依性 {id="manage-dependencies-with-a-bom"}

[物料清單 (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms) 是一種特殊的 POM 檔案，用於管理專案中的相依性版本。這可以保持相關構件一致，並避免版本衝突。

Kotlin 發布了 [`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom) 構件，它指定了與同一個 Kotlin 發行版本相對應的 Kotlin 程式庫版本（例如 `kotlin-stdlib`、`kotlin-reflect` 和 `kotlin-test`）。當專案中的其他程式庫對 Kotlin 構件具有間接相依性時，這非常有用，因為它能確保所有相依性都解析為相同的 Kotlin 版本。

若要使用 Kotlin BOM，請將其匯入 `pom.xml` 檔案的 `<dependencyManagement>` 區塊，如下所示：

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

匯入 BOM 後，您可以在 `<dependencies>` 區塊中宣告 Kotlin 相依性，而無需指定其版本；版本會自動從 BOM 檔案中取得。

* 匯入 BOM 本身不會為您的專案新增任何相依性。它僅控制明確宣告的相依性和間接相依性的版本。
* 如果您仍然為某個相依性指定了 `<version>`，該值將會覆蓋來自 BOM 的版本。

如果您的專案發布了多個同時發行的程式庫，您可以提供自己的 BOM，以便使用者可以以相同的方式統一這些程式庫的版本。若要了解如何編寫自己的 BOM，請參閱 [Maven 文件](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)。

## 接下來？ {id="what-s-next"}

[配置 Kotlin 編譯器](maven-kotlin-compiler.md)