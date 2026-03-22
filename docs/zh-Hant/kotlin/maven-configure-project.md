[//]: # (title: 設定 Maven 專案)

若要使用 Maven 組建 Kotlin 專案，您需要將 Kotlin Maven 外掛程式新增至您的 `pom.xml` 建置檔案中，宣告存儲庫並設定專案的相依性。

## 啟用並設定外掛程式

`kotlin-maven-plugin` 用於編譯 Kotlin 原始碼與模組。目前僅支援 Maven v3。

若要套用 Kotlin Maven 外掛程式，請按照以下方式更新您的 `pom.xml` 建置檔案：

1. 在 `<properties>` 區塊中，於 `kotlin.version` 屬性內定義您想要使用的 Kotlin 版本：

   ```xml
   <properties>
       <kotlin.version>%kotlinVersion%</kotlin.version>
   </properties>
   ```

2. 在 `<build><plugins>` 區塊中，新增 Kotlin Maven 外掛程式：

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

3. <p id="extension">(選填) 您也可以啟用 <code>extensions</code> 選項來簡化專案設定。若要這麼做，請更新您 `pom.xml` 檔案中的 Kotlin Maven 外掛程式區塊：</p>

   ```xml
   <plugins>
       <plugin>
           <groupId>org.jetbrains.kotlin</groupId>
           <artifactId>kotlin-maven-plugin</artifactId>
           <version>${kotlin.version}</version>
           <extensions>true</extensions> <!-- 新增此擴充套件 -->
       </plugin>
   </plugins>
   ```

   Kotlin Maven 外掛程式中的 `extensions` 選項會自動執行以下操作：

   * 如果 `src/main/kotlin` 與 `src/test/kotlin` 目錄已經存在，但未在外掛程式組態中指定，則自動將其註冊為原始碼根目錄。
   * 如果專案中尚未定義 [`kotlin-stdlib` 相依性](#dependency-on-the-standard-library)，則自動新增。

### 使用 JDK 17

若要使用 JDK 17，請在您的 `.mvn/jvm.config` 檔案中新增：

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## 宣告存儲庫

根據預設，`mavenCentral` 存儲庫可用於所有 Maven 專案。若要存取其他存儲庫中的構件，請在 `<repositories>` 區塊中為存儲庫名稱指定自訂 ID 及其 URL：

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> 如果您在 Gradle 專案中將 `mavenLocal()` 宣告為存儲庫，則在 Gradle 與 Maven 專案之間切換時可能會遇到問題。若要了解更多資訊，請參閱 [宣告存儲庫](gradle-configure-project.md#declare-repositories)。
>
{style="note"}

## 設定相依性

若要新增對程式庫的相依性，請將其包含在 `<dependencies>` 區塊中：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-serialization-json</artifactId>
        <version>%serializationVersion%</version>
    </dependency>
</dependencies>
```

### 對標準函式庫的相依性

Kotlin 擁有豐富的標準函式庫，可供您在應用程式中使用。您可以手動新增標準函式庫相依性，或者啟用 [`extensions` 選項](#extension) 以便在缺失時自動設定。

#### 手動設定

若要手動將 Kotlin 標準函式庫新增至您的專案，請使用以下內容更新 `pom.xml` 檔案中的 `dependencies` 區塊：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <!-- 使用在 <properties/> 中指定的
             kotlin.version 屬性： --> 
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> 如果您的目標是 JDK 7 或 8，且使用的 Kotlin 版本早於：
> * 1.8，請分別使用 `kotlin-stdlib-jdk7` 或 `kotlin-stdlib-jdk8`。
> * 1.2，請分別使用 `kotlin-stdlib-jre7` 或 `kotlin-stdlib-jre8`。
>
{style="note"}

### 自動設定

您可以使用 Kotlin Maven 外掛程式提供的 [`extensions` 選項](#extension) 來避免手動設定。當專案中未定義 `kotlin-stdlib` 相依性時，它會自動新增，例如當您建立新的 Kotlin Maven 專案或將 Kotlin 引入現有的 Java Maven 專案時。

您也可以選擇停用自動新增標準函式庫。為此，請將以下內容新增至 `<properties>` 區塊：

```xml
<project>
    <properties>
        <kotlin.smart.defaults.enabled>false</kotlin.smart.defaults.enabled>         
    </properties>
</project>
```

請注意，此屬性會停用所有簡化設定功能，包括原始碼根路徑的註冊。

### 對測試函式庫的相依性

如果您的專案使用 [Kotlin 反射](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/) 或測試框架，請新增相關的相依性。反射函式庫請使用 `kotlin-reflect`，測試函式庫請使用 `kotlin-test` 與 `kotlin-test-junit5`：

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

### 對 kotlinx 程式庫的相依性

對於 kotlinx 程式庫，您可以新增基礎構件名稱，或是帶有 `-jvm` 字尾的名稱。請參閱 [klibs.io](https://klibs.io/) 上該程式庫的 README 檔案。

例如，若要新增對 [`kotlinx.coroutines`](https://kotlinlang.org/api/kotlinx.coroutines/) 程式庫的相依性：

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

### 使用 BOM 相依性機制

若要使用 Kotlin [物料清單 (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)，請新增對 [`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom) 的相依性：

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

## 接下來要做什麼？

[編譯並封裝您的 Kotlin Maven 專案](maven-compile-package.md)