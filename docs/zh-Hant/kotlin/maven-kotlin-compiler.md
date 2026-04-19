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
    <extensions>true</extensions> <!-- 如果您想要在外掛程式建置中啟用自動加入執行 -->
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
|-------------------|-----------------------------------|------------------------------------------------------------------------------------------------------|---------------------------------------------------------|-----------------------------|
| `nowarn`          |                                   | 不產生警告 | true, false                                             | false                       |
| `languageVersion` | `kotlin.compiler.languageVersion` | 提供與指定 Kotlin 版本的原始碼相容性 | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" （實驗性） |                             |
| `apiVersion`      | `kotlin.compiler.apiVersion`      | 僅允許使用來自指定版本隨附程式庫的宣告 | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" （實驗性） |                             |
| `sourceDirs`      |                                   | 包含要編譯的原始碼檔案目錄 |                                                         | 專案原始碼根目錄 |
| `compilerPlugins` |                                   | 啟用的編譯器外掛程式 |                                                         | []                          |
| `pluginOptions`   |                                   | 編譯器外掛程式的選項 |                                                         | []                          |
| `args`            |                                   | 額外的編譯器引數 |                                                         | []                          |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`       | 產生的 JVM 位元組碼目標版本 | "1.8", "9", "10", ..., "25"                             | "%defaultJvmTargetVersion%" |
| `jdkHome`         | `kotlin.compiler.jdkHome`         | 從指定位置包含自訂 JDK 到 classpath，而非使用預設的 JAVA_HOME |                                                         |                             |

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

為了加快建置速度，您可以透過加入 `kotlin.compiler.incremental` 屬性來啟用增量編譯：

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

或者，使用 `-Dkotlin.compiler.incremental=true` 選項來執行建置。

## 下一步？

[封裝您的專案](maven-compile-package.md)