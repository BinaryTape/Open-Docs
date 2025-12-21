[//]: # (title: 配置 Maven 專案)

要使用 Maven 建置 Kotlin 專案，您需要在 `pom.xml` 建置檔案中新增 Kotlin Maven 外掛、宣告儲存庫，並設定專案的依賴項。

## 啟用並設定外掛

`kotlin-maven-plugin` 會編譯 Kotlin 原始碼和模組。目前僅支援 Maven v3。

要套用 Kotlin Maven 外掛，請按以下方式更新您的 `pom.xml` 建置檔案：

1.  在 `<properties>` 區塊中，於 `kotlin.version` 屬性中定義您想使用的 Kotlin 版本：

    ```xml
    <properties>
        <kotlin.version>%kotlinVersion%</kotlin.version>
    </properties>
    ```

2.  在 `<build><plugins>` 區塊中，新增 Kotlin Maven 外掛：

    ```xml
    <plugins>
        <plugin>
            <artifactId>kotlin-maven-plugin</artifactId>
            <groupId>org.jetbrains.kotlin</groupId>
            <version>%kotlinVersion%</version>
        </plugin>
    </plugins>
    ```

### 使用 JDK 17

要使用 JDK 17，請在您的 `.mvn/jvm.config` 檔案中新增：

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## 宣告儲存庫

預設情況下，所有 Maven 專案都可使用 `mavenCentral` 儲存庫。若要存取其他儲存庫中的構件 (artifact)，請在 `<repositories>` 區塊中為儲存庫名稱及其 URL 指定一個自訂 ID：

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> 如果您在 Gradle 專案中將 `mavenLocal()` 宣告為儲存庫，您在 Gradle 和 Maven 專案之間切換時可能會遇到問題。有關更多資訊，請參閱 [宣告儲存庫](gradle-configure-project.md#declare-repositories)。
>
{style="note"}

## 設定依賴項

若要新增對函式庫的依賴項，請將其包含在 `<dependencies>` 區塊中：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-serialization-json</artifactId>
        <version>%serializationVersion%</version>
    </dependency>
</dependencies>
```

### 標準函式庫的依賴項

Kotlin 擁有一個您可以在應用程式中使用的廣泛標準函式庫。若要在您的專案中使用標準函式庫，請將以下依賴項新增至您的 `pom.xml` 檔案：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <!-- Uses the kotlin.version property 
            specified in <properties/>: --> 
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> 如果您使用早於以下版本的 Kotlin 並以 JDK 7 或 8 為目標：
> * 1.8，請分別使用 `kotlin-stdlib-jdk7` 或 `kotlin-stdlib-jdk8`。
> * 1.2，請分別使用 `kotlin-stdlib-jre7` 或 `kotlin-stdlib-jre8`。
>
{style="note"}

### 測試函式庫的依賴項

如果您的專案使用 [Kotlin 反射](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/) 或測試框架，請新增相關依賴項。反射函式庫請使用 `kotlin-reflect`，測試函式庫請使用 `kotlin-test` 和 `kotlin-test-junit5`：

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

### 對 kotlinx 函式庫的依賴項

對於 kotlinx 函式庫，您可以新增基礎構件名稱，或是帶有 `-jvm` 後綴的名稱。請參考 [klibs.io](https://klibs.io/) 上該函式庫的 `README` 檔案。

例如，若要新增對 [`kotlinx.coroutines`](https://kotlinlang.org/api/kotlinx.coroutines/) 函式庫的依賴項：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-coroutines-core</artifactId>
        <version>%coroutinesVersion%</version>
    </dependency>
</dependencies>
```

若要新增對 [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) 函式庫的依賴項：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-datetime-jvm</artifactId>
        <version>%dateTimeVersion%</version>
    </dependency>
</dependencies>
```

### 使用 BOM 依賴機制

若要使用 Kotlin [物料清單 (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)，請新增對 [`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom) 的依賴項：

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

## 接下來呢？

[編譯並打包您的 Kotlin Maven 專案](maven-compile-package.md)