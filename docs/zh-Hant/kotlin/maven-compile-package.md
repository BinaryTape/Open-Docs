[//]: # (title: 編譯與封裝 Maven 專案)

您可以設定您的 Maven 專案，以編譯僅限 Kotlin 或 Kotlin 與 Java 混合的原始碼，設定 Kotlin 編譯器，指定編譯器選項，並將您的應用程式封裝成 JAR。

## 設定原始碼編譯

為了確保您的原始碼能正確編譯，請調整專案組態。
您的 Maven 專案可以設定為編譯 [僅限 Kotlin 的原始碼](#compile-kotlin-only-sources) 或 [Kotlin 與 Java 混合的原始碼](#compile-kotlin-and-java-sources)。

### 編譯僅限 Kotlin 的原始碼

若要編譯您的 Kotlin 原始碼：

1. 在 `<build>` 區塊中指定原始碼目錄：

    ```xml
    <build>
        <sourceDirectory>src/main/kotlin</sourceDirectory>
        <testSourceDirectory>src/test/kotlin</testSourceDirectory>
    </build>
    ```

2. 確保已套用 Kotlin Maven 外掛程式：

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

您可以將上面的整個 `<executions>` 區塊替換為 `<extensions>true</extensions>`。
啟用擴充套件會自動將 `compile`、`test-compile`、`kapt` 與 `test-kapt` 執行新增到您的組建中，並繫結到其適當的 [生命週期階段](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)。
如果您需要設定某個執行，則需要指定其 ID。您可以在下一節中找到相關範例。

> 如果有多個建置外掛程式覆寫了預設生命週期，且您也啟用了 `extensions` 選項，則 `<build>` 區塊中最後一個外掛程式在生命週期設定方面具有優先權。所有早先對生命週期設定的變更都將被忽略。
>
{style="note"}

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

### 編譯 Kotlin 與 Java 原始碼

若要編譯同時包含 Kotlin 與 Java 原始檔的專案，請確保 Kotlin 編譯器在 Java 編譯器之前執行。
Java 編譯器在 Kotlin 宣告編譯為 `.class` 檔案之前無法看見它們。
如果您的 Java 程式碼使用了 Kotlin 類別，則必須先編譯這些類別，以避免 `cannot find symbol` 錯誤。

Maven 根據兩個主要因素來決定外掛程式的執行順序：

* `pom.xml` 檔案中外掛程式宣告的順序。
* 內建的預設執行（例如 `default-compile` 與 `default-testCompile`），無論其在 `pom.xml` 檔案中的位置為何，它們一律在使用者定義的執行之前執行。

若要控制執行順序：

* 在 `maven-compiler-plugin` 之前宣告 `kotlin-maven-plugin`。
* 停用 Java 編譯器外掛程式的預設執行。
* 新增自訂執行以明確控制編譯階段。

> 您可以使用 Maven 中特殊的 `none` 階段來停用預設執行。
>
{style="note"}

您可以使用 `extensions` 來簡化 Kotlin/Java 混合編譯的設定。
這允許跳過 Maven 編譯器外掛程式的設定：

<tabs group="kotlin-java-maven">
<tab title="使用擴充套件" group-key="with-extensions">

```xml
<build>
    <plugins>
        <!-- Kotlin compiler plugin configuration -->
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
                            <!-- Ensure Kotlin code can reference Java code -->
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
        <!-- No need to configure Maven compiler plugin with extensions -->
    </plugins>
</build>
```

如果您的專案先前使用的是僅限 Kotlin 的設定，您還需要從 `<build>` 區塊中移除以下幾行：

```xml
<build>
    <sourceDirectory>src/main/kotlin</sourceDirectory>
    <testSourceDirectory>src/test/kotlin</testSourceDirectory>
</build>
```

透過 `extensions` 設定，這能確保 Kotlin 程式碼可以參照 Java 程式碼，反之亦然。

</tab>
<tab title="不使用擴充套件" group-key="no-extensions">

```xml
<build>
    <plugins>
        <!-- Kotlin compiler plugin configuration -->
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
                            <!-- Ensure Kotlin code can reference Java code -->
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

        <!-- Maven compiler plugin configuration -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.14.0</version>
            <executions>
                <!-- Disable default executions -->
                <execution>
                    <id>default-compile</id>
                    <phase>none</phase>
                </execution>
                <execution>
                    <id>default-testCompile</id>
                    <phase>none</phase>
                </execution>

                <!-- Define custom executions -->
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

此設定可確保：

* Kotlin 程式碼優先編譯。
* Java 程式碼在 Kotlin 之後編譯，且可以參照 Kotlin 類別。
* 預設的 Maven 行為不會覆寫外掛程式順序。

如需更多關於 Maven 如何處理外掛程式執行的詳細資訊，請參閱官方 Maven 文件中的 [預設外掛程式執行 ID 指南](https://maven.apache.org/guides/mini/guide-default-execution-ids.html)。

## 設定 Kotlin 編譯器

### 選擇執行策略

_Kotlin 編譯器執行策略_定義了 Kotlin 編譯器在何處執行。有兩種可用的策略：

| 策略                      | Kotlin 編譯器執行的位置 |
|-------------------------|-------------------|
| Kotlin daemon（預設） | 在其自身的 daemon 處理序內 |
| 在處理序內 (In process)   | 在 Maven 處理序內     |

預設情況下使用 [Kotlin daemon](kotlin-daemon.md)。您可以透過在 `pom.xml` 檔案中設定以下屬性來切換到「在處理序內」策略：

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

無論您使用哪種編譯器執行策略，您仍然需要明確設定累加編譯。

### 啟用累加編譯

為了讓您的建置更快，您可以透過新增 `kotlin.compiler.incremental` 屬性來啟用累加編譯：

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

或者，使用 `-Dkotlin.compiler.incremental=true` 選項來執行您的建置。

### 指定編譯器選項

編譯器的額外選項與引數可以在 Maven 外掛程式節點的 `<configuration>` 區塊中指定為元素：

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- 如果您想要啟用自動新增執行到您的建置中 -->
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn>  <!-- 停用警告 -->
        <args>
            <arg>-Xjsr305=strict</arg> <!-- 為 JSR-305 註解啟用嚴格模式 -->
            ...
        </args>
    </configuration>
</plugin>
```

許多選項也可以透過屬性來設定：

```xml
<project ...>
    <properties>
        <kotlin.compiler.languageVersion>%languageVersion%</kotlin.compiler.languageVersion>
    </properties>
</project>
```

支援以下屬性：

#### JVM 特有的屬性

| 名稱              | 屬性名稱                            | 描述                                                                                          | 可能的值                                         | 預設值               |
|-------------------|---------------------------------|------------------------------------------------------------------------------------------------------|---------------------------------------------------------|-----------------------------|
| `nowarn`          |                                 | 不產生警告                                                                                 | true, false                                             | false                       |
| `languageVersion` | kotlin.compiler.languageVersion | 提供與指定 Kotlin 版本的原始碼相容性                                    | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (實驗功能) |                             |
| `apiVersion`      | kotlin.compiler.apiVersion      | 僅允許使用來自指定版本的隨附程式庫中的宣告                        | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (實驗功能) |                             |
| `sourceDirs`      |                                 | 包含要編譯的原始檔目錄                                               |                                                         | 專案原始碼根目錄    |
| `compilerPlugins` |                                 | 已啟用的編譯器外掛程式                                                                             |                                                         | []                          |
| `pluginOptions`   |                                 | 編譯器外掛程式的選項                                                                         |                                                         | []                          |
| `args`            |                                 | 額外的編譯器引數                                                                        |                                                         | []                          |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`     | 產生的 JVM 位元組碼目標版本                                                         | "1.8", "9", "10", ..., "25"                             | "%defaultJvmTargetVersion%" |
| `jdkHome`         | `kotlin.compiler.jdkHome`       | 從指定位置包含自訂 JDK 到 classpath，而非使用預設的 JAVA_HOME |                                                         |                             |

## 封裝您的專案

### 建立 JAR 檔案

若要建立一個僅包含模組程式碼的小型 JAR 檔案，請在 Maven `pom.xml` 檔案的 `<build><plugins>` 下包含以下內容，其中 `main.class` 定義為屬性並指向 Kotlin 或 Java 的主要類別：

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.5.0</version>
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

### 建立自我包含的 JAR 檔案

若要建立一個包含模組程式碼及其相依性的自我包含 JAR 檔案，請在 Maven `pom.xml` 檔案的 `<build><plugins>` 下包含以下內容，其中 `main.class` 定義為屬性並指向 Kotlin 或 Java 的主要類別：

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-assembly-plugin</artifactId>
    <version>3.8.0</version>
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

此自我包含的 JAR 檔案可以直接傳遞給 JRE 來執行您的應用程式：

``` bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar