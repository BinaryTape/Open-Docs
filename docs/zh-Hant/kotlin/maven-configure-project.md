[//]: # (title: 設定 Maven 專案)

當您將 Kotlin 引入現有的 Java Maven 專案或建立新的 Kotlin Maven 專案時，您需要新增用於編譯 Kotlin 原始碼與模組的 Kotlin Maven 外掛程式。

目前僅支援 Maven v3。

## 自動設定

您可以使用 `<extensions>` 選項簡化混合 Java-Kotlin 專案以及純 Kotlin 專案中的 Maven 設定。這種方法可以節省您的時間，因為您不需要手動設定 Maven 編譯器外掛程式。

若要套用帶有 `<extensions>` 的 Kotlin Maven 外掛程式，請按照以下方式更新您的 `pom.xml` 建置檔案：

1. 在 `<properties>` 區塊中，於 `kotlin.version` 屬性內定義您想要使用的 Kotlin 版本：

   ```xml
   <properties>
       <kotlin.version>%kotlinVersion%</kotlin.version>
   </properties>
   ```

2. 在 `<build><plugins>` 區塊中，新增啟用 `<extensions>` 選項的 Kotlin Maven 外掛程式：

   ```xml
   <build>
       <plugins>
           <!-- Kotlin 編譯器外掛程式設定 -->
           <plugin>
               <groupId>org.jetbrains.kotlin</groupId>
               <artifactId>kotlin-maven-plugin</artifactId>
               <version>${kotlin.version}</version>
               <extensions>true</extensions> <!-- 啟用此擴充套件 -->
           </plugin>
           <!-- 使用 extensions 時不需要設定 Maven 編譯器外掛程式 -->
       </plugins>
   </build>
   ```

`<extensions>` 選項會執行以下操作：

* 如果 `src/main/kotlin` 與 `src/test/kotlin` 目錄已經存在，但未在外掛程式組態中指定，則自動將其註冊為原始碼根目錄。
* 如果專案中尚未定義 [`kotlin-stdlib` 相依性](maven-set-dependencies.md#dependency-on-the-standard-library)，則自動新增。
* 將 `compile`、`test-compile`、`kapt` 與 `test-kapt` 的執行新增至您的建置中，並繫結至適當的 [生命週期階段](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)。因此，您不需要手動設定帶有 `<id>` 與 `<goals>` 的 `<executions>` 區塊。
   
如果您擁有混合 Java 與 Kotlin 的專案，此設定可確保：

* Kotlin 程式碼優先編譯。
* Java 程式碼在 Kotlin 之後編譯，並可以參考 Kotlin 類別。
* 預設的 Maven 行為不會覆蓋外掛程式順序。

擴充套件設定會取代整個 `<executions>` 區塊。如果您需要自訂執行，請參閱 [編譯 Kotlin 與 Java 原始碼](#compile-kotlin-and-java-sources) 中的範例。

> 如果有多個建置外掛程式覆寫了預設生命週期，且您也啟用了 `<extensions>` 選項，則 `<build>` 區塊中的最後一個外掛程式在生命週期設定上具有優先權。所有先前對生命週期設定的變更都將被忽略。
>
{style="note"}

### 更改 Maven 編譯器版本

目前，與 `<extensions>` 搭配使用的 Maven 編譯器外掛程式預設版本為 **%mavenExtensionsVersion%**。您可以單獨設定不同的版本：

```xml
<build>
    <plugins>
        <!-- Kotlin 編譯器外掛程式設定 -->
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <extensions>true</extensions>
        </plugin>
        <!-- 用於 Java 類別的 Maven 編譯器外掛程式設定 -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>%mavenPluginVersion%</version>
        </plugin>
    </plugins>
</build>
```

## 手動設定

若不啟用 Kotlin Maven 外掛程式中的 `<extensions>`，您需要手動設定專案以確保原始碼正確編譯。

您可以設定您的 Maven 專案來編譯 [Java 與 Kotlin 原始碼的組合](#compile-kotlin-and-java-sources) 或 [純 Kotlin 原始碼](#compile-kotlin-only-sources)。

### 編譯 Kotlin 與 Java 原始碼

若要編譯同時包含 Kotlin 與 Java 原始檔的專案，請確保 Kotlin 編譯器在 Java 編譯器之前執行。

在 Kotlin 類別被編譯成 `.class` 檔案之前，Java 編譯器無法看見它們。如果您的 Java 程式碼使用了 Kotlin 類別，則必須先編譯這些類別以避免 `cannot find symbol` 錯誤。

Maven 根據兩個主要因素決定外掛程式執行順序：

* `pom.xml` 檔案中外掛程式宣告的順序。
* 內建的預設執行（例如 `default-compile` 與 `default-testCompile`），無論它們在 `pom.xml` 檔案中的位置為何，它們總是在使用者定義的執行之前執行。

若要控制執行順序：

* 在 `maven-compiler-plugin` 之前宣告 `kotlin-maven-plugin`。
* 停用 Java 編譯器外掛程式的預設執行。
* 新增自訂執行以明確控制編譯階段。

> 您可以在 Maven 中使用特殊的 `none` 階段來停用預設執行。
>
{style="note"}

若要套用 Kotlin Maven 外掛程式，請按照以下方式更新您的 `pom.xml` 建置檔案：

```xml
<build>
    <plugins>
        <!-- Kotlin 編譯器外掛程式設定 -->
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
                            <!-- 確保 Kotlin 程式碼可以參考 Java 程式碼 -->
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

        <!-- Maven 編譯器外掛程式設定 -->
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <version>3.15.0</version>
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

此設定可確保：

* Kotlin 程式碼優先編譯。
* Java 程式碼在 Kotlin 之後編譯，並可以參考 Kotlin 類別。
* 預設的 Maven 行為不會覆蓋外掛程式順序。

如需更多關於 Maven 如何處理外掛程式執行的詳細資訊，請參閱 Maven 官方文件中的 [預設外掛程式執行 ID 指南](https://maven.apache.org/guides/mini/guide-default-execution-ids.html)。

### 編譯純 Kotlin 原始碼

若要編譯僅包含 Kotlin 原始檔的專案，請宣告原始碼根目錄並設定 Kotlin Maven 外掛程式：

1. 在 `<build>` 區塊中指定原始碼目錄：

    ```xml
    <build>
        <sourceDirectory>src/main/kotlin</sourceDirectory>
        <testSourceDirectory>src/test/kotlin</testSourceDirectory>
    </build>
    ```

2. 確保套用了 Kotlin Maven 外掛程式：

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

### 使用 JDK 17

若要使用 JDK 17，請在您的 `.mvn/jvm.config` 檔案中新增：

```none
--add-opens=java.base/java.lang=ALL-UNNAMED
--add-opens=java.base/java.io=ALL-UNNAMED
```

## 接下來要做什麼？

[在您的 Kotlin Maven 專案中設定相依性](maven-set-dependencies.md)