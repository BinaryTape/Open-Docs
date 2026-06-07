[//]: # (title: 為您的 Maven 專案配置 Kotlin 編譯器)

`kotlin-maven-plugin` 允許您為 Maven 專案配置 Kotlin 編譯器。
您可以指定編譯器選項、選擇執行策略，並啟用增量編譯。

## 指定編譯器選項

您可以在 Kotlin Maven 外掛程式節點的 `<configuration>` 區段中，將額外的選項與引數指定為元素：

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- 如果您想要在組建中啟用自動加入執行 -->
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn> <!-- 停用警告 -->
        <args>
            <arg>-Xjsr305=strict</arg> <!-- 為 JSR-305 註解啟用嚴格模式 -->
            ...
        </args>
    </configuration>
</plugin>
```

許多選項也可以透過屬性進行配置：

```xml
<project>
    <properties>
        <kotlin.compiler.languageVersion>%languageVersion%</kotlin.compiler.languageVersion>
    </properties>
</project>
```

支援以下屬性：

### 針對 JVM 的特定屬性

| 名稱 | 屬性名稱 | 說明 | 可能的值 | 預設值 |
|-------------------|-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------|-----------------------------|
| `nowarn`          |                                   | 不產生警告 | true, false                                             | false                       |
| `languageVersion` | `kotlin.compiler.languageVersion` | 提供與指定 Kotlin 版本的原始碼相容性 | "2.0", "2.1", "2.2", "2.3", "2.4", "2.5" （實驗性） |                             |
| `apiVersion`      | `kotlin.compiler.apiVersion`      | 僅允許使用來自指定版本隨附程式庫的宣告 | "2.0", "2.1", "2.2", "2.3", "2.4", "2.5" （實驗性） |                             |
| `sourceDirs`      |                                   | 包含要編譯的原始碼檔案目錄 |                                                         | 專案原始碼根目錄 |
| `compilerPlugins` |                                   | 啟用的編譯器外掛程式 |                                                         | []                          |
| `pluginOptions`   |                                   | 編譯器外掛程式的選項 |                                                         | []                          |
| `args`            |                                   | 額外的編譯器引數 |                                                         | []                          |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`       | 產生的位元組碼目標 JVM 版本。僅控制輸出位元組碼版本，不會限制您的程式碼可以使用的 JDK API。 | "1.8", "9", "10", ..., "26"                             | "%defaultJvmTargetVersion%" |
| `jdkRelease`      | `kotlin.compiler.jdkRelease`      | 目標 JVM 版本。控制位元組碼版本並將可用的 API 限制為指定的 JDK 版本，防止意外使用較新的 API。相當於 Java 的 `--release` 編譯器選項。 | "1.8", "9", "10", ..., "26"                             |                             |
| `jdkHome`         | `kotlin.compiler.jdkHome`         | 從指定位置包含自訂 JDK 到 classpath，而非使用預設的 `JAVA_HOME` |                                                         |                             |
| `jdkToolchain`    | `kotlin.compiler.jdkToolchain`    | 設定要從工具鏈使用的 JDK 版本。僅影響 Kotlin 編譯 |                                                         |                             |

## 選擇執行策略

<snippet id="maven-configure-execution-strategy">

預設情況下，Maven 使用 Kotlin daemon 編譯器執行策略。若要切換到「進程內 (in process)」策略，請在您的 `pom.xml` 檔案中設定以下屬性：

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

</snippet>

有關不同策略的更多資訊，請參閱[編譯器執行策略](compiler-execution-strategy.md)。

## 啟用增量編譯

為了加快組建速度，您可以透過加入 `kotlin.compiler.incremental` 屬性來啟用增量編譯：

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

或者，使用 `-Dkotlin.compiler.incremental=true` 選項來執行組建。

## 下一步？

[封裝您的專案](maven-compile-package.md)