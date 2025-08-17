[//]: # (title: 添加客户端依赖项)

<show-structure for="chapter" depth="2"/>

<link-summary>了解如何向现有项目添加客户端依赖项。</link-summary>

要在你的项目中集成 Ktor HTTP 客户端，你需要[配置仓库](#repositories)并添加以下依赖项：

- **[ktor-client-core](#client-dependency)**

  `ktor-client-core` 包含核心 Ktor 客户端功能。
- **[引擎依赖项](#engine-dependency)**

  引擎用于处理网络请求。
  请注意，[特定平台](client-supported-platforms.md)可能需要一个特定的引擎来处理网络请求。
- （可选）**[日志记录依赖项](#logging-dependency)**

  提供日志框架以启用结构化和灵活的日志记录功能。

- （可选）**[插件依赖项](#plugin-dependency)**

  插件用于通过特定功能扩展客户端。

<p>
    在添加 Ktor 依赖项之前，你需要为该项目配置仓库：
</p>
<list>
    <li>
        <p>
            <control>生产版本</control>
        </p>
        <p>
            Ktor 的生产版本在 Maven 中央仓库中可用。
            你可以在构建脚本中按如下方式声明此仓库：
        </p>
        <Tabs group="languages">
            <TabItem title="Gradle (Kotlin)" group-key="kotlin">
                <code-block lang="Kotlin" code="                    repositories {&#10;                        mavenCentral()&#10;                    }"/>
            </TabItem>
            <TabItem title="Gradle (Groovy)" group-key="groovy">
                <code-block lang="Groovy" code="                    repositories {&#10;                        mavenCentral()&#10;                    }"/>
            </TabItem>
            <TabItem title="Maven" group-key="maven">
                <note>
                    <p>
                        你无需在 <path>pom.xml</path> 文件中添加 Maven 中央仓库，因为你的项目会从
                        <a href="https://maven.apache.org/guides/introduction/introduction-to-the-pom.html#super-pom">Super POM</a> 继承中央仓库。
                    </p>
                </note>
            </TabItem>
        </Tabs>
    </li>
    <li>
        <p>
            <control>抢先体验计划 (EAP)</control>
        </p>
        <p>
            要获取 Ktor 的 <a href="https://ktor.io/eap/">EAP</a> 版本，你需要引用 <a href="https://maven.pkg.jetbrains.space/public/p/ktor/eap/io/ktor/">Space 仓库</a>：
        </p>
        <Tabs group="languages">
            <TabItem title="Gradle (Kotlin)" group-key="kotlin">
                <code-block lang="Kotlin" code="                    repositories {&#10;                        maven {&#10;                            url = uri(&quot;https://maven.pkg.jetbrains.space/public/p/ktor/eap&quot;)&#10;                        }&#10;                    }"/>
            </TabItem>
            <TabItem title="Gradle (Groovy)" group-key="groovy">
                <code-block lang="Groovy" code="                    repositories {&#10;                        maven {&#10;                            url &quot;https://maven.pkg.jetbrains.space/public/p/ktor/eap&quot;&#10;                        }&#10;                    }"/>
            </TabItem>
            <TabItem title="Maven" group-key="maven">
                <code-block lang="XML" code="                    &lt;repositories&gt;&#10;                        &lt;repository&gt;&#10;                            &lt;id&gt;ktor-eap&lt;/id&gt;&#10;                            &lt;url&gt;https://maven.pkg.jetbrains.space/public/p/ktor/eap&lt;/url&gt;&#10;                        &lt;/repository&gt;&#10;                    &lt;/repositories&gt;"/>
            </TabItem>
        </Tabs>
        <p>
            请注意，Ktor EAP 可能需要 <a href="https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev">Kotlin 开发仓库</a>：
        </p>
        <Tabs group="languages">
            <TabItem title="Gradle (Kotlin)" group-key="kotlin">
                <code-block lang="Kotlin" code="                    repositories {&#10;                        maven {&#10;                            url = uri(&quot;https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev&quot;)&#10;                        }&#10;                    }"/>
            </TabItem>
            <TabItem title="Gradle (Groovy)" group-key="groovy">
                <code-block lang="Groovy" code="                    repositories {&#10;                        maven {&#10;                            url &quot;https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev&quot;&#10;                        }&#10;                    }"/>
            </TabItem>
            <TabItem title="Maven" group-key="maven">
                <code-block lang="XML" code="                    &lt;repositories&gt;&#10;                        &lt;repository&gt;&#10;                            &lt;id&gt;ktor-eap&lt;/id&gt;&#10;                            &lt;url&gt;https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev&lt;/url&gt;&#10;                        &lt;/repository&gt;&#10;                    &lt;/repositories&gt;"/>
            </TabItem>
        </Tabs>
    </li>
</list>

## 添加依赖项 {id="add-ktor-dependencies"}

> 对于[不同的平台](client-supported-platforms.md)，Ktor 提供带 `-jvm` 或 `-js` 等后缀的平台特有的构件，例如 `ktor-client-core-jvm`。请注意，Gradle 会自动解析适用于给定平台的构件，而 Maven 不支持此能力。这意味着对于 Maven，你需要手动添加平台特有的后缀。
>
{type="tip"}

### 客户端依赖项 {id="client-dependency"}

主要的客户端功能在 `ktor-client-core` 构件中可用。根据你的构建系统，你可以按以下方式添加它：

<var name="artifact_name" value="ktor-client-core"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

你可以将 `$ktor_version` 替换为所需的 Ktor 版本，例如 `%ktor_version%`。

#### 多平台 {id="client-dependency-multiplatform"}

对于多平台项目，你可以在 `gradle/libs.versions.toml` 文件中定义 Ktor 版本和 `ktor-client-core` 构件：

```kotlin
[versions]
ktor = "3.2.3"
[libraries]
kotlin-test = { module = "org.jetbrains.kotlin:kotlin-test", version.ref = "kotlin" }
ktor-client-okhttp = { module = "io.ktor:ktor-client-okhttp", version.ref = "ktor" }
```

然后，将 `ktor-client-core` 作为依赖项添加到 `commonMain` 源代码集：

```kotlin
sourceSets {
    commonMain.dependencies {
        implementation(libs.ktor.client.core)
    }
}
```

### 引擎依赖项 {id="engine-dependency"}

[引擎](client-engines.md)负责处理网络请求。针对各种平台，有不同的客户端引擎可用，例如 Apache、CIO、Android、iOS 等。例如，你可以按如下方式添加 `CIO` 引擎依赖项：

<var name="artifact_name" value="ktor-client-cio"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

#### 多平台 {id="engine-dependency-multiplatform"}

对于多平台项目，你需要为所需的引擎向相应的源代码集添加依赖项。

例如，要为 Android 添加 `OkHttp` 引擎依赖项，你可以首先在 `gradle/libs.versions.toml` 文件中定义 Ktor 版本和 `ktor-client-okhttp` 构件：

```kotlin
[versions]
ktor = "3.2.3"
[libraries]
kotlin-test = { module = "org.jetbrains.kotlin:kotlin-test", version.ref = "kotlin" }
ktor-client-darwin = { module = "io.ktor:ktor-client-darwin", version.ref = "ktor" }
```

然后，将 `ktor-client-okhttp` 作为依赖项添加到 `androidMain` 源代码集：

```kotlin
sourceSets {
    androidMain.dependencies {
        implementation(libs.ktor.client.okhttp)
    }
}
```

有关特定引擎所需依赖项的完整列表，请参见[添加引擎依赖项](client-engines.md#dependencies)。

### 日志记录依赖项

  <p>
    在 <a href="#jvm">JVM</a> 上，Ktor 使用 Java 简单日志门面
    (<a href="http://www.slf4j.org/">SLF4J</a>) 作为日志记录的抽象层。SLF4J 将日志 API 与底层日志实现解耦，
    使你能够集成最适合你应用程序需求的日志框架。
    常见的选择包括 <a href="https://logback.qos.ch/">Logback</a> 或
    <a href="https://logging.apache.org/log4j">Log4j</a>。如果没有提供框架，SLF4J 将默认为空操作 (NOP) 实现，
    这本质上禁用了日志记录。
  </p>

  <p>
    要启用日志记录，请包含带有所需 SLF4J 实现的构件，例如
    <a href="https://logback.qos.ch/">Logback</a>：
  </p>
  <var name="group_id" value="ch.qos.logback"/>
  <var name="artifact_name" value="logback-classic"/>
  <var name="version" value="logback_version"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;%group_id%:%artifact_name%:$%version%&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;%group_id%:%artifact_name%:$%version%&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;%group_id%&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%&lt;/artifactId&gt;&#10;                  &lt;version&gt;${%version%}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>

有关 Ktor 客户端中日志记录的更多信息，请参见 [Ktor 客户端中的日志记录](client-logging.md)。

### 插件依赖项 {id="plugin-dependency"}

Ktor 允许你使用默认不提供的额外客户端功能（[插件](client-plugins.md)），例如授权和序列化。其中一些插件以独立的构件提供。你可以从所需插件的主题中了解你需要哪些依赖项。

> 对于多平台项目，插件依赖项应添加到 `commonMain` 源代码集。请注意，某些插件可能对特定平台有[限制](client-engines.md#limitations)。

## 确保 Ktor 版本一致性

<chapter title="使用 Ktor BOM 依赖项">

Ktor BOM 允许你确保所有 Ktor 模块使用相同的一致版本，而无需为每个依赖项单独指定版本。

要添加 Ktor BOM 依赖项，请在你的构建脚本中按如下方式声明它：

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(platform(&quot;io.ktor:ktor-bom:$ktor_version&quot;))"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation platform &quot;io.ktor:ktor-bom:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependencyManagement&gt;&#10;              &lt;dependencies&gt;&#10;                  &lt;dependency&gt;&#10;                      &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                      &lt;artifactId&gt;ktor-bom&lt;/artifactId&gt;&#10;                      &lt;version&gt;%ktor_version%&lt;/version&gt;&#10;                      &lt;type&gt;pom&lt;/type&gt;&#10;                      &lt;scope&gt;import&lt;/scope&gt;&#10;                  &lt;/dependency&gt;&#10;              &lt;/dependencies&gt;&#10;          &lt;/dependencyManagement&gt;"/>
    </TabItem>
</Tabs>
</chapter>

<var name="target_module" value="client"/>
<p>
    你还可以通过使用已发布的版本目录来集中管理 Ktor 依赖项声明。
    这种方法提供以下好处：
</p>
<list id="published-version-catalog-benefits">
    <li>
        消除了手动在你自己的目录中声明 Ktor 版本的需要。
    </li>
    <li>
        在单个命名空间下公开每个 Ktor 模块。
    </li>
</list>
<p>
    要声明该目录，请在
    <path>settings.gradle.kts</path> 文件中创建一个你所选名称的版本目录：
</p>
<code-block lang="kotlin" code="    dependencyResolutionManagement {&#10;        versionCatalogs {&#10;            create(&quot;ktorLibs&quot;) {&#10;                from(&quot;io.ktor:ktor-version-catalog:%ktor_version%&quot;)&#10;            }&#10;        }&#10;    }"/>
<p>
    然后，你可以在模块的
    <path>build.gradle.kts</path> 文件中通过引用目录名称来添加依赖项：
</p>
<code-block lang="kotlin" code="    dependencies {&#10;        implementation(ktorLibs.%target_module%.core)&#10;        // ...&#10;    }"/>