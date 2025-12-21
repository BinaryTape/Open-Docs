[//]: # (title: 編譯與打包 Maven 專案)

您可以設定您的 Maven 專案，以編譯僅 Kotlin 原始碼或混合 Kotlin 與 Java 的原始碼，設定 Kotlin 編譯器，指定編譯器選項，並將您的應用程式打包成 JAR 檔。

## 設定原始碼編譯

為了確保您的原始碼能夠正確編譯，請調整專案組態設定。您的 Maven 專案可以設定為編譯[僅限 Kotlin 原始碼](#compile-kotlin-only-sources)或[Kotlin 與 Java 原始碼](#compile-kotlin-and-java-sources)的組合。

### 編譯僅 Kotlin 原始碼

要編譯您的 Kotlin 原始碼：

1. 在 `<build>` 區塊中指定原始碼目錄：

    ```xml
    <build>
        <sourceDirectory>src/main/kotlin</sourceDirectory>
        <testSourceDirectory>src/test/kotlin</testSourceDirectory>
    </build>
    ```

2. 確保 Kotlin Maven 插件已套用：

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

您可以將上述整個 `<executions>` 區塊替換為 `<extensions>true</extensions>`。啟用 extensions 會自動將 `compile`、`test-compile`、`kapt` 和 `test-kapt` 執行項目新增到您的建置中，並綁定到其適當的[生命週期階段](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)。如果您需要設定一個執行項目，則需要指定其 ID。您可以在下一節中找到範例。

> 如果有多個建置插件覆寫了預設生命週期，並且您也啟用了 `extensions` 選項，則 `<build>` 區塊中最後一個插件在生命週期設定方面具有優先權。所有先前的生命週期設定變更都將被忽略。
>
{style="note"}

<!-- The following header is used in the Mari link service. If you wish to change it here, change the link there too -->

### 編譯 Kotlin 與 Java 原始碼

要編譯同時包含 Kotlin 和 Java 原始碼檔案的專案，請確保 Kotlin 編譯器在 Java 編譯器之前執行。Java 編譯器無法看到 Kotlin 宣告，直到它們被編譯成 `.class` 檔案。如果您的 Java 程式碼使用了 Kotlin 類別，則這些類別必須首先被編譯，以避免 `cannot find symbol` 錯誤。

Maven 根據兩個主要因素來決定插件的執行順序：

* `pom.xml` 檔案中插件宣告的順序。
* 內建的預設執行項目，例如 `default-compile` 和 `default-testCompile`，它們總是會在使用者定義的執行項目之前運行，無論它們在 `pom.xml` 檔案中的位置為何。

為了控制執行順序：

* 在 `maven-compiler-plugin` 之前宣告 `kotlin-maven-plugin`。
* 禁用 Java 編譯器插件的預設執行項目。
* 新增自訂執行項目以明確控制編譯階段。

> 您可以使用 Maven 中的特殊 `none` 階段來禁用預設執行項目。
>
{style="note"}

您可以使用 `extensions` 來簡化 Kotlin/Java 混合編譯的組態設定。它允許跳過 Maven 編譯器插件的組態設定：

<tabs group="kotlin-java-maven">
<tab title="使用 extensions" group-key="with-extensions">

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

如果您的專案之前是 Kotlin-only 設定，您還需要從 `<build>` 區塊中移除以下行：

```xml
<build>
    <sourceDirectory>src/main/kotlin</sourceDirectory>
    <testSourceDirectory>src/test/kotlin</testSourceDirectory>
</build>
```

這確保了在使用 `extensions` 設定時，Kotlin 程式碼可以引用 Java 程式碼，反之亦然。

</tab>
<tab title="不使用 extensions" group-key="no-extensions">

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

此組態設定確保了：

* Kotlin 程式碼首先被編譯。
* Java 程式碼在 Kotlin 之後編譯，並且可以引用 Kotlin 類別。
* Maven 的預設行為不會覆寫插件順序。

有關 Maven 如何處理插件執行的更多詳細資訊，請參閱 Maven 官方文件中的 [預設插件執行 ID 指南](https://maven.apache.org/guides/mini/guide-default-execution-ids.html)。

## 設定 Kotlin 編譯器

### 選擇執行策略

_Kotlin 編譯器執行策略_ 定義了 Kotlin 編譯器的運行位置。有兩種可用的策略：

| 策略                | Kotlin 編譯器執行位置         |
|---------------------|-------------------------------|
| Kotlin daemon (預設) | 在其自身的 daemon 處理程序中 |
| 在處理程序中        | 在 Maven 處理程序中         |

預設情況下，會使用 [Kotlin daemon](kotlin-daemon.md)。您可以透過在 `pom.xml` 檔案中設定以下屬性來切換到「在處理程序中」策略：

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

無論您使用哪種編譯器執行策略，您仍然需要明確設定增量編譯。

### 啟用增量編譯

為了加快您的建置速度，您可以透過新增 `kotlin.compiler.incremental` 屬性來啟用增量編譯：

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

或者，您可以使用 `-Dkotlin.compiler.incremental=true` 選項來執行建置。

### 指定編譯器選項

編譯器的額外選項和參數可以在 Maven 插件節點的 `<configuration>` 區塊中指定為元素：

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

許多選項也可以透過屬性進行設定：

```xml
<project ...>
    <properties>
        <kotlin.compiler.languageVersion>%languageVersion%</kotlin.compiler.languageVersion>
    </properties>
</project>
```

支援以下屬性：

#### 僅限 JVM 的屬性

| 名稱              | 屬性名稱                   | 描述                                                                    | 可能的值                                         | 預設值               |
|-------------------|-----------------------------|-------------------------------------------------------------------------|--------------------------------------------------|---------------------|
| `nowarn`          |                             | 不生成警告                                                              | true, false                                      | false               |
| `languageVersion` | kotlin.compiler.languageVersion | 提供與指定 Kotlin 版本的原始碼相容性                                  | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (實驗性) |                     |
| `apiVersion`      | kotlin.compiler.apiVersion  | 僅允許使用來自指定版本捆綁函式庫的宣告                                | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (實驗性) |                     |
| `sourceDirs`      |                             | 包含要編譯的原始碼檔案的目錄                                          |                                                  | 專案原始碼根目錄    |
| `compilerPlugins` |                             | 啟用的編譯器插件                                                      |                                                  | []                  |
| `pluginOptions`   |                             | 編譯器插件選項                                                        |                                                  | []                  |
| `args`            |                             | 額外的編譯器參數                                                      |                                                  | []                  |
| `jvmTarget`       | `kotlin.compiler.jvmTarget` | 生成 JVM 位元碼的目標版本                                             | "1.8", "9", "10", ..., "25"                      | "%defaultJvmTargetVersion%" |
| `jdkHome`         | `kotlin.compiler.jdkHome`   | 將指定位置的自訂 JDK 包含到 classpath 中，而不是預設的 JAVA_HOME        |                                                  |                     |

## 打包您的專案

### 建立 JAR 檔

為了建立一個僅包含模組程式碼的小型 JAR 檔，請在您的 Maven `pom.xml` 檔案的 `<build><plugins>` 下包含以下內容，其中 `main.class` 被定義為一個屬性，並指向主要的 Kotlin 或 Java 類別：

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

### 建立獨立的 JAR 檔

為了建立一個包含您的模組程式碼及其依賴項的獨立 JAR 檔，請在您的 Maven `pom.xml` 檔案的 `<build><plugins>` 下包含以下內容，其中 `main.class` 被定義為一個屬性，並指向主要的 Kotlin 或 Java 類別：

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

此獨立 JAR 檔可以直接傳遞給 JRE 以運行您的應用程式：

```bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar