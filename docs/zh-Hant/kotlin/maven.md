[//]: # (title: Maven)

Maven 是一個建置系統，可用於建置和管理任何基於 Java 的專案。

## 配置並啟用外掛

`kotlin-maven-plugin` 編譯 Kotlin 原始碼和模組。目前僅支援 Maven v3。

在您的 `pom.xml` 檔案中，於 `kotlin.version` 屬性中定義您想要使用的 Kotlin 版本：

```xml
<properties>
    <kotlin.version>%kotlinVersion%</kotlin.version>
</properties>
```

要啟用 `kotlin-maven-plugin`，請更新您的 `pom.xml` 檔案：

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

要使用 JDK 17，請在您的 `.mvn/jvm.config` 檔案中加入：

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## 宣告儲存庫

預設情況下，所有 Maven 專案均可使用 `mavenCentral` 儲存庫。要存取其他儲存庫中的構件，請在 `<repositories>` 元素中指定每個儲存庫的 ID 和 URL：

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> 如果您在 Gradle 專案中將 `mavenLocal()` 宣告為儲存庫，在 Gradle 和 Maven 專案之間切換時可能會遇到問題。更多資訊請參閱[宣告儲存庫](gradle-configure-project.md#declare-repositories)。
>
{style="note"}

## 設定依賴

Kotlin 擁有一個廣泛的標準函式庫，可用於您的應用程式。
要在您的專案中使用標準函式庫，請在您的 `pom.xml` 檔案中加入以下依賴：

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> 如果您目標為 JDK 7 或 8，且使用的 Kotlin 版本早於：
> * 1.8，請分別使用 `kotlin-stdlib-jdk7` 或 `kotlin-stdlib-jdk8`。
> * 1.2，請分別使用 `kotlin-stdlib-jre7` 或 `kotlin-stdlib-jre8`。
>
{style="note"}

如果您的專案使用 [Kotlin 反射](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/index.html)或測試設施，您還需要加入相應的依賴。反射函式庫的構件 ID 是 `kotlin-reflect`，測試函式庫的構件 ID 是 `kotlin-test` 和 `kotlin-test-junit`。

## 編譯僅限 Kotlin 的原始碼

要編譯原始碼，請在 `<build>` 標籤中指定原始碼目錄：

```xml
<build>
    <sourceDirectory>${project.basedir}/src/main/kotlin</sourceDirectory>
    <testSourceDirectory>${project.basedir}/src/test/kotlin</testSourceDirectory>
</build>
```

需要引用 Kotlin Maven 外掛來編譯原始碼：

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

從 Kotlin 1.8.20 開始，您可以將上述整個 `<executions>` 元素替換為 `<extensions>true</extensions>`。啟用擴展會自動將 `compile`、`test-compile`、`kapt` 和 `test-kapt` 執行加入到您的建置中，並綁定到其相應的[生命週期階段](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)。如果您需要配置一個執行，您需要指定其 ID。您可以在下一節中找到此範例。

> 如果有多個建置外掛覆寫預設生命週期，並且您也啟用了 `extensions` 選項，則 `<build>` 部分中最後一個外掛在生命週期設定方面具有優先權。所有先前對生命週期設定的變更都將被忽略。
>
{style="note"}

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

## 編譯 Kotlin 和 Java 原始碼

要編譯包含 Kotlin 和 Java 原始碼的專案，請在 Java 編譯器之前呼叫 Kotlin 編譯器。以 Maven 的術語來說，這表示 `kotlin-maven-plugin` 應該在使用以下方法時在 `maven-compiler-plugin` 之前執行，確保 `kotlin` 外掛在您的 `pom.xml` 檔案中位於 `maven-compiler-plugin` 之前：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions> <!-- You can set this option 
            to automatically take information about lifecycles -->
            <executions>
                <execution>
                    <id>compile</id>
                    <goals>
                        <goal>compile</goal> <!-- You can skip the <goals> element 
                        if you enable extensions for the plugin -->
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>${project.basedir}/src/main/kotlin</sourceDir>
                            <sourceDir>${project.basedir}/src/main/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
                <execution>
                    <id>test-compile</id>
                    <goals> 
                        <goal>test-compile</goal> <!-- You can skip the <goals> element 
                    if you enable extensions for the plugin -->
                    </goals>
                    <configuration>
                        <sourceDirs>
                            <sourceDir>${project.basedir}/src/test/kotlin</sourceDir>
                            <sourceDir>${project.basedir}/src/test/java</sourceDir>
                        </sourceDirs>
                    </configuration>
                </execution>
            </executions>
        </plugin>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.5.1</version>
            <executions>
                <!-- Replacing default-compile as it is treated specially by Maven -->
                <execution>
                    <id>default-compile</id>
                    <phase>none</phase>
                </execution>
                <!-- Replacing default-testCompile as it is treated specially by Maven -->
                <execution>
                    <id>default-testCompile</id>
                    <phase>none</phase>
                </execution>
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

## 啟用增量編譯

為了讓您的建置更快，您可以透過加入 `kotlin.compiler.incremental` 屬性來啟用增量編譯：

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

或者，使用 `-Dkotlin.compiler.incremental=true` 選項執行您的建置。

## 配置註解處理

請參閱 [`kapt` – 在 Maven 中使用](kapt.md#use-in-maven)。

## 建立 JAR 檔案

要建立一個僅包含您模組程式碼的小型 JAR 檔案，請在您的 Maven `pom.xml` 檔案的 `build->plugins` 下包含以下內容，其中 `main.class` 被定義為一個屬性並指向主要的 Kotlin 或 Java 類別：

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

## 建立自行包含的 JAR 檔案

要建立一個包含您模組程式碼及其依賴的自行包含 JAR 檔案，請在您的 Maven `pom.xml` 檔案的 `build->plugins` 下包含以下內容，其中 `main.class` 被定義為一個屬性並指向主要的 Kotlin 或 Java 類別：

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

這個自行包含的 JAR 檔案可以直接傳遞給 JRE 以執行您的應用程式：

``` bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar
```

## 指定編譯器選項

編譯器的額外選項和引數可以作為標籤在 Maven 外掛節點的 `<configuration>` 元素下指定：

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- If you want to enable automatic addition of executions to your build -->
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn>  <!-- Disable warnings -->
        <args>
            <arg>-Xjsr305=strict</arg> <!-- Enable strict mode for JSR-305 annotations -->
            ...
        </args>
    </configuration>
</plugin>
```

許多選項也可以透過屬性進行配置：

```xml
<project ...>
    <properties>
        <kotlin.compiler.languageVersion>%languageVersion%</kotlin.compiler.languageVersion>
    </properties>
</project>
```

支援以下屬性：

### 針對 JVM 的屬性

| 名稱              | 屬性名稱                   | 描述                                                                                          | 可能值                                   | 預設值               |
|-------------------|----------------------------|-------------------------------------------------------------------------------------------------|------------------------------------------|----------------------|
| `nowarn`          |                            | 不產生警告                                                                                      | true, false                              | false                |
| `languageVersion` | kotlin.compiler.languageVersion | 提供與指定 Kotlin 版本的原始碼相容性                                                            | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |                      |
| `apiVersion`      | kotlin.compiler.apiVersion | 僅允許使用來自指定版本捆綁函式庫的宣告                                                          | "1.8", "1.9", "2.0", "2.1", "2.2" (EXPERIMENTAL) |                      |
| `sourceDirs`      |                            | 包含要編譯的原始檔的目錄                                                                        |                                          | 專案原始碼根目錄     |
| `compilerPlugins` |                            | 已啟用的編譯器外掛                                                                              |                                          | []                   |
| `pluginOptions`   |                            | 編譯器外掛的選項                                                                                |                                          | []                   |
| `args`            |                            | 額外的編譯器引數                                                                                |                                          | []                   |
| `jvmTarget`       | `kotlin.compiler.jvmTarget` | 生成的 JVM 位元碼的目標版本                                                                     | "1.8", "9", "10", ..., "23"              | "%defaultJvmTargetVersion%" |
| `jdkHome`         | `kotlin.compiler.jdkHome`  | 將指定位置的自訂 JDK 包含到類別路徑中，而不是預設的 JAVA_HOME                                   |                                          |                      |

## 使用 BOM

要使用 Kotlin 的[物料清單 (BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms)，請撰寫對 [`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom) 的依賴：

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

標準的 Javadoc 生成外掛 (`maven-javadoc-plugin`) 不支援 Kotlin 程式碼。要為 Kotlin 專案生成文件，請使用 [Dokka](https://github.com/Kotlin/dokka)。Dokka 支援混合語言專案，並且可以以多種格式生成輸出，包括標準 Javadoc。有關如何在 Maven 專案中配置 Dokka 的更多資訊，請參閱[Maven](dokka-maven.md)。

## 啟用 OSGi 支援

[學習如何在您的 Maven 專案中啟用 OSGi 支援](kotlin-osgi.md#maven)。