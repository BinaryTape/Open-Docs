[//]: # (title: Maven)

Maven 是一個建構系統，可用於建構和管理任何基於 Java 的專案。

## 配置並啟用外掛程式

`kotlin-maven-plugin` 會編譯 Kotlin 原始碼和模組。目前僅支援 Maven v3。

在您的 `pom.xml` 檔案中，於 `kotlin.version` 屬性中定義您要使用的 Kotlin 版本：

```xml
<properties>
    <kotlin.version>%kotlinVersion%</kotlin.version>
</properties>
```

若要啟用 `kotlin-maven-plugin`，請更新您的 `pom.xml` 檔案：

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

若要使用 JDK 17，請在您的 `.mvn/jvm.config` 檔案中加入：

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## 宣告儲存庫

依預設，`mavenCentral` 儲存庫適用於所有 Maven 專案。若要存取其他儲存庫中的構件，請在 `<repositories>` 元素中指定每個儲存庫的 ID 和 URL：

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> 如果您在 Gradle 專案中將 `mavenLocal()` 宣告為儲存庫，則在 Gradle 和 Maven 專案之間切換時可能會遇到問題。如需更多資訊，請參閱[宣告儲存庫](gradle-configure-project.md#declare-repositories)。
>
{style="note"}

## 設定依賴項

若要新增對函式庫的依賴項，請將其包含在 `<dependencies>` 元素中：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-serialization-json</artifactId>
        <version>%serializationVersion%</version>
    </dependency>
</dependencies>
```

### 對標準函式庫的依賴項

Kotlin 擁有豐富的標準函式庫，可用於您的應用程式。若要在您的專案中使用標準函式庫，請將以下依賴項新增到您的 `pom.xml` 檔案中：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <!-- 使用 <properties/> 中指定的 kotlin.version 屬性： --> 
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> 如果您以 JDK 7 或 8 為目標，且 Kotlin 版本早於：
> * 1.8，請分別使用 `kotlin-stdlib-jdk7` 或 `kotlin-stdlib-jdk8`。
> * 1.2，請分別使用 `kotlin-stdlib-jre7` 或 `kotlin-stdlib-jre8`。
>
{style="note"}

### 對測試函式庫的依賴項

如果您的專案使用 [Kotlin 反射](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/index.html)或測試框架，請新增相關的依賴項。反射函式庫請使用 `kotlin-reflect`，測試函式庫請使用 `kotlin-test` 和 `kotlin-test-junit`。

例如：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-reflect</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

### 對 kotlinx 函式庫的依賴項

根據 kotlinx 函式庫的不同，您可以新增基礎構件名稱或帶有 `-jvm` 後綴的名稱。請參考該函式庫在 [klibs.io](https://klibs.io/) 上的 README 檔案。

例如，若要新增對 `kotlinx.coroutines` 的依賴項：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-coroutines-core</artifactId>
        <version>%coroutinesVersion%</version>
    </dependency>
</dependencies>
```

若要新增對 `kotlinx-datetime` 的依賴項：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-datetime-jvm</artifactId>
        <version>%dateTimeVersion%</version>
    </dependency>
</dependencies>
```

## 編譯僅限 Kotlin 的原始碼

若要編譯原始碼，請在 `<build>` 標籤中指定原始碼目錄：

```xml
<build>
    <sourceDirectory>src/main/kotlin</sourceDirectory>
    <testSourceDirectory>src/test/kotlin</testSourceDirectory>
</build>
```

需要引用 Kotlin Maven 外掛程式才能編譯原始碼：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>

            <executions>
                <execution>
                    <id>compile</id>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                </execution>

                <execution>
                    <id>test-compile</id>
                    <goals>
                        <goal>test-compile</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

從 Kotlin 1.8.20 開始，您可以將上述整個 `<executions>` 元素替換為 `<extensions>true</extensions>`。啟用擴展會自動將 `compile`、`test-compile`、`kapt` 和 `test-kapt` 執行添加到您的建構中，並將它們綁定到其適當的[生命週期階段](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)。如果您需要配置執行，則需要指定其 ID。您可以在下一節中找到此範例。

> 如果多個建構外掛程式覆寫了預設生命週期，並且您也啟用了 `extensions` 選項，則 `<build>` 區段中的最後一個外掛程式在生命週期設定方面具有優先權。所有先前對生命週期設定的更改都將被忽略。
>
{style="note"}

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

## 編譯 Kotlin 和 Java 原始碼

若要編譯包含 Kotlin 和 Java 原始碼檔案的專案，請確保 Kotlin 編譯器在 Java 編譯器之前執行。Java 編譯器在 Kotlin 宣告被編譯成 `.class` 檔案之前無法看到它們。如果您的 Java 程式碼使用 Kotlin 類別，則必須先編譯這些類別，以避免「cannot find symbol」錯誤。

Maven 會根據兩個主要因素來確定外掛程式的執行順序：

* 外掛程式在 `pom.xml` 檔案中的宣告順序。
* 內建的預設執行，例如 `default-compile` 和 `default-testCompile`，它們始終在使用者定義的執行之前運行，無論它們在 `pom.xml` 檔案中的位置如何。

若要控制執行順序：

* 請在 `maven-compiler-plugin` 之前宣告 `kotlin-maven-plugin`。
* 停用 Java 編譯器外掛程式的預設執行。
* 新增自訂執行以明確控制編譯階段。

> 您可以使用 Maven 中特殊的 `none` 階段來停用預設執行。
>
{style="note"}

您可以使用擴展來簡化混合 Kotlin/Java 編譯的配置。它允許跳過 Maven 編譯器外掛程式的配置：

<tabs group="kotlin-java-maven">
<tab title="使用擴展" group-key="with-extensions">

```xml
<build>
    <plugins>
        <!-- Kotlin 編譯器外掛程式配置 -->
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions>
            <executions>
                <execution>
                    <id>default-compile</id>
                    <phase>compile</phase>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/main/kotlin</sourceDir>
                            <!-- 確保 Kotlin 程式碼可以引用 Java 程式碼 -->
                            <sourceDir>src/main/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
                <execution>
                    <id>default-test-compile</id>
                    <phase>test-compile</phase>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/test/kotlin</sourceDir>
                            <sourceDir>src/test/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
            </executions>
        </plugin>
        <!-- 使用擴展時無需配置 Maven 編譯器外掛程式 -->
    </plugins>
</build>
```

如果您的專案先前只有 Kotlin 配置，您還需要從 `<build>` 區段中移除以下幾行：

```xml
<build>
    <sourceDirectory>src/main/kotlin</sourceDirectory>
    <testSourceDirectory>src/test/kotlin</testSourceDirectory>
</build>
```

這確保在 `extensions` 設定下，Kotlin 程式碼可以引用 Java 程式碼，反之亦然。

</tab>
<tab title="不使用擴展" group-key="no-extensions">

```xml
<build>
    <plugins>
        <!-- Kotlin 編譯器外掛程式配置 -->
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <executions>
                <execution>
                    <id>kotlin-compile</id>
                    <phase>compile</phase>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/main/kotlin</sourceDir>
                            <!-- 確保 Kotlin 程式碼可以引用 Java 程式碼 -->
                            <sourceDir>src/main/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
                <execution>
                    <id>kotlin-test-compile</id>
                    <phase>test-compile</phase>
                    <goals>
                        <goal>test-compile</goal>
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>src/test/kotlin</sourceDir>
                            <sourceDir>src/test/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
            </executions>
        </plugin>

        <!-- Maven 編譯器外掛程式配置 -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.14.0</version>
            <executions>
                <!-- 停用預設執行 -->
                <execution>
                    <id>default-compile</id>
                    <phase>none</phase>
                </execution>
                <execution>
                    <id>default-testCompile</id>
                    <phase>none</phase>
                </execution>

                <!-- 定義自訂執行 -->
                <execution>
                    <id>java-compile</id>
                    <phase>compile</phase>
                    <goals>
                        <goal>compile</goal>
                    </goals>
                </execution>
                <execution>
                    <id>java-test-compile</id>
                    <phase>test-compile</phase>
                    <goals>
                        <goal>testCompile</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>

此配置確保：

* Kotlin 程式碼先被編譯。
* Java 程式碼在 Kotlin 之後編譯，並且可以引用 Kotlin 類別。
* 預設的 Maven 行為不會覆寫外掛程式順序。

有關 Maven 如何處理外掛程式執行的更多詳細資訊，請參閱官方 Maven 文件中的[預設外掛程式執行 ID 指南](https://maven.apache.org/guides/mini/guide-default-execution-ids.html)。

## 配置 Kotlin 編譯器執行策略

_Kotlin 編譯器執行策略_定義了 Kotlin 編譯器執行的位置。有兩種可用策略：

| 策略                | Kotlin 編譯器執行的位置       |
|-------------------------|---------------------------------------|
| Kotlin daemon (預設) | 在其專屬的 daemon 程序中         |
| 在程序內              | 在 Maven 程序中              |

依預設，會使用 [Kotlin daemon](kotlin-daemon.md)。您可以透過在 `pom.xml` 檔案中設定以下屬性來切換到「在程序內」策略：

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

無論您使用哪種編譯器執行策略，您仍然需要明確配置增量編譯。

## 啟用增量編譯

為了加速您的建構，您可以透過新增 `kotlin.compiler.incremental` 屬性來啟用增量編譯：

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

或者，使用 `-Dkotlin.compiler.incremental=true` 選項執行您的建構。

## 配置註解處理

請參閱 [`kapt` – 在 Maven 中使用](kapt.md#use-in-maven)。

## 建立 JAR 檔案

若要建立一個只包含您的模組程式碼的小型 JAR 檔案，請將以下內容包含在 Maven `pom.xml` 檔案的 `build->plugins` 下，其中 `main.class` 定義為屬性並指向主要的 Kotlin 或 Java 類別：

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>2.6</version>
    <configuration>
        <archive>
            <manifest>
                <addClasspath>true</addClasspath>
                <mainClass>${main.class}</mainClass>
            </manifest>
        </archive>
    </configuration>
</plugin>
```

## 建立獨立 JAR 檔案

若要建立一個包含您的模組程式碼及其依賴項的獨立 JAR 檔案，請將以下內容包含在 Maven `pom.xml` 檔案的 `build->plugins` 下，其中 `main.class` 定義為屬性並指向主要的 Kotlin 或 Java 類別：

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-assembly-plugin</artifactId>
    <version>2.6</version>
    <executions>
        <execution>
            <id>make-assembly</id>
            <phase>package</phase>
            <goals> <goal>single</goal> </goals>
            <configuration>
                <archive>
                    <manifest>
                        <mainClass>${main.class}</mainClass>
                    </manifest>
                </archive>
                <descriptorRefs>
                    <descriptorRef>jar-with-dependencies</descriptorRef>
                </descriptorRefs>
            </configuration>
        </execution>
    </executions>
</plugin>
```

此獨立 JAR 檔案可以直接傳遞給 JRE 以執行您的應用程式：

``` bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar
```

## 指定編譯器選項

編譯器的額外選項和引數可以在 Maven 外掛程式節點的 `<configuration>` 元素下指定為標籤：

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- 如果您要啟用自動將執行加入您的建構 -->
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn>  <!-- 停用警告 -->
        <args>
            <arg>-Xjsr305=strict</arg> <!-- 啟用 JSR-305 註解的嚴格模式 -->
            ...
        </args>
    </configuration>
</plugin>
```

許多選項也可以透過屬性來配置：

```xml
<project ...>
    <properties>
        <kotlin.compiler.languageVersion>%languageVersion%</kotlin.compiler.languageVersion>
    </properties>
</project>
```

支援以下屬性：

### JVM 特有屬性

| 名稱              | 屬性名稱                        | 描述                                                                                                 | 可能值                                           | 預設值                     |
|-------------------|---------------------------------|------------------------------------------------------------------------------------------------------|--------------------------------------------------|-----------------------------|
| `nowarn`          |                                 | 不生成警告                                                                                           | true, false                                      | false                       |
| `languageVersion` | `kotlin.compiler.languageVersion` | 提供與指定 Kotlin 版本相容的原始碼                                                                   | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |                             |
| `apiVersion`      | `kotlin.compiler.apiVersion`      | 允許僅使用指定版本的捆綁函式庫中的宣告                                                               | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |                             |
| `sourceDirs`      |                                 | 包含要編譯的原始碼檔案的目錄                                                                         |                                                  | 專案原始碼根目錄            |
| `compilerPlugins` |                                 | 已啟用的編譯器外掛程式                                                                               |                                                  | []                          |
| `pluginOptions`   |                                 | 編譯器外掛程式的選項                                                                                 |                                                  | []                          |
| `args`            |                                 | 其他編譯器引數                                                                                       |                                                  | []                          |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`     | 生成的 JVM 位元碼的目標版本                                                                          | "1.8", "9", "10", ..., "24"                      | "%defaultJvmTargetVersion%" |
| `jdkHome`         | `kotlin.compiler.jdkHome`       | 將指定位置的自訂 JDK 包含到 classpath 中，而非預設的 JAVA_HOME                                       |                                                  |                             |

## 使用 BOM

若要使用 Kotlin [物料清單 (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)，請編寫對 [`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom) 的依賴項：

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

## 生成文件

標準的 Javadoc 生成外掛程式 (`maven-javadoc-plugin`) 不支援 Kotlin 程式碼。若要為 Kotlin 專案生成文件，請使用 [Dokka](https://github.com/Kotlin/dokka)。Dokka 支援混合語言專案，並且可以生成多種格式的輸出，包括標準 Javadoc。有關如何在您的 Maven 專案中配置 Dokka 的更多資訊，請參閱 [Maven](dokka-maven.md)。

## 啟用 OSGi 支援

[了解如何在您的 Maven 專案中啟用 OSGi 支援](kotlin-osgi.md#maven)。