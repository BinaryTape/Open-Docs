[//]: # (title: Maven)

要为基于 Maven 的项目生成文档，你可以使用 Dokka 的 Maven 插件。

> 与 [Dokka 的 Gradle 插件](dokka-gradle.md)相比，Maven 插件仅具有基本特性，并且
> 不支持多模块构建。
> 
{style="note"}

你可以通过访问我们的 [Maven 示例](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/maven)项目来试用 Dokka，并了解如何为 Maven 项目配置它。

## 应用 Dokka

要应用 Dokka，你需要将 `dokka-maven-plugin` 添加到你的 POM 文件的 `plugins` 部分：

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.dokka</groupId>
            <artifactId>dokka-maven-plugin</artifactId>
            <version>%dokkaVersion%</version>
            <executions>
                <execution>
                    <phase>pre-site</phase>
                    <goals>
                        <goal>dokka</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

## 生成文档

Maven 插件提供了以下目标：

| **目标**      | **描述**                                                                       |
|---------------|--------------------------------------------------------------------------------|
| `dokka:dokka` | 使用 Dokka 插件生成文档。默认格式为 [HTML](dokka-html.md)。 |

### 实验性的

| **目标**           | **描述**                                                                            |
|--------------------|-------------------------------------------------------------------------------------|
| `dokka:javadoc`    | 以 [Javadoc](dokka-javadoc.md) 格式生成文档。                                            |
| `dokka:javadocJar` | 生成一个包含 [Javadoc](dokka-javadoc.md) 格式文档的 `javadoc.jar` 文件。 |

### 其他输出格式

默认情况下，Dokka 的 Maven 插件以 [HTML](dokka-html.md) 输出格式构建文档。

所有其他输出格式都作为 [Dokka 插件](dokka-plugins.md)实现。为了生成所需格式的文档，你必须将其作为 Dokka 插件添加到配置中。

例如，要使用实验性的 [GFM](dokka-markdown.md#gfm) 格式，你必须添加 `gfm-plugin` 构件：

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <dokkaPlugins>
            <plugin>
                <groupId>org.jetbrains.dokka</groupId>
                <artifactId>gfm-plugin</artifactId>
                <version>%dokkaVersion%</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

使用此配置，运行 `dokka:dokka` 目标会生成 GFM 格式的文档。

要了解有关 Dokka 插件的更多信息，请参见 [Dokka 插件](dokka-plugins.md)。

## 构建 javadoc.jar

如果你想将你的库发布到版本库，你可能需要提供一个包含库 API 参考文档的 `javadoc.jar` 文件。

例如，如果你想发布到 [Maven Central](https://central.sonatype.org/)，你[必须](https://central.sonatype.org/publish/requirements/)随项目提供一个 `javadoc.jar`。但是，并非所有版本库都有此规则。

与 [Dokka 的 Gradle 插件](dokka-gradle.md#build-javadoc-jar)不同，Maven 插件自带一个开箱即用的 `dokka:javadocJar` 目标。默认情况下，它会在 `target` 文件夹中生成 [Javadoc](dokka-javadoc.md) 输出格式的文档。

如果你不满意内置目标，或者想要自定义输出（例如，你希望生成 [HTML](dokka-html.md) 格式而不是 Javadoc 文档），可以通过添加 Maven JAR 插件并进行以下配置来实现类似的行为：

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.3.0</version>
    <executions>
        <execution>
            <goals>
                <goal>test-jar</goal>
            </goals>
        </execution>
        <execution>
            <id>dokka-jar</id>
            <phase>package</phase>
            <goals>
                <goal>jar</goal>
            </goals>
            <configuration>
                <classifier>dokka</classifier>
                <classesDirectory>${project.build.directory}/dokka</classesDirectory>
                <skipIfEmpty>true</skipIfEmpty>
            </configuration>
        </execution>
    </executions>
</plugin>
```

然后通过运行 `dokka:dokka` 和 `jar:jar@dokka-jar` 目标来生成文档及其 `.jar` 归档文件：

```Bash
mvn dokka:dokka jar:jar@dokka-jar
```

> 如果你将你的库发布到 Maven Central，你可以使用 [javadoc.io](https://javadoc.io/) 等服务免费托管你的库的 API 文档，无需任何设置。它直接从 `javadoc.jar` 中获取文档页面。它与 HTML 格式配合良好，如[此示例](https://javadoc.io/doc/com.trib3/server/latest/index.html)所示。
>
{style="tip"}

## 配置示例

Maven 的插件配置块可用于配置 Dokka。

以下是一个基本配置示例，它只更改文档的输出位置：

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <outputDir>${project.basedir}/target/documentation/dokka</outputDir>
    </configuration>
</plugin>
```

## 配置选项

Dokka 有许多配置选项可以定制你和读者的体验。

以下是一些示例以及每个配置部分的详细描述。你还可以找到一个应用了[所有配置选项](#complete-configuration)的示例，位于页面底部。

### 通用配置

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <skip>false</skip>
        <moduleName>${project.artifactId}</moduleName>
        <outputDir>${project.basedir}/target/documentation</outputDir>
        <failOnWarning>false</failOnWarning>
        <suppressObviousFunctions>true</suppressObviousFunctions>
        <suppressInheritedMembers>false</suppressInheritedMembers>
        <offlineMode>false</offlineMode>
        <sourceDirectories>
            <dir>${project.basedir}/src</dir>
        </sourceDirectories>
        <documentedVisibilities>
            <visibility>PUBLIC</visibility>
            <visibility>PROTECTED</visibility>
        </documentedVisibilities>
        <reportUndocumented>false</reportUndocumented>
        <skipDeprecated>false</skipDeprecated>
        <skipEmptyPackages>true</skipEmptyPackages>
        <suppressedFiles>
            <file>/path/to/dir</file>
            <file>/path/to/file</file>
        </suppressedFiles>
        <jdkVersion>8</jdkVersion>
        <languageVersion>1.7</languageVersion>
        <apiVersion>1.7</apiVersion>
        <noStdlibLink>false</noStdlibLink>
        <noJdkLink>false</noJdkLink>
        <includes>
            <include>packages.md</include>
            <include>extra.md</include>
        </includes>
        <classpath>${project.compileClasspathElements}</classpath>
        <samples>
            <dir>${project.basedir}/samples</dir>
        </samples>
        <sourceLinks>
            <!-- Separate section -->
        </sourceLinks>
        <externalDocumentationLinks>
            <!-- Separate section -->
        </externalDocumentationLinks>
        <perPackageOptions>
            <!-- Separate section -->
        </perPackageOptions>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="跳过">
        <p>是否跳过文档生成。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="模块名称">
        <p>用于指代项目/模块的显示名称。它用于目录、导航、日志记录等。</p>
        <p>默认值：<code>{project.artifactId}</code></p>
    </def>
    <def title="输出目录">
        <p>文档的生成目录，不分格式。</p>
        <p>默认值：<code>{project.basedir}/target/dokka</code></p>
    </def>
    <def title="警告时失败">
        <p>
            如果 Dokka 发出了警告或错误，是否使文档生成失败。此过程会先等待
            所有错误和警告都发出。
        </p>
        <p>此设置与 <code>reportUndocumented</code> 配合良好。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="抑制明显函数">
        <p>是否抑制明显函数。</p>
        <p>
            如果函数是以下情况，则被认为是明显的：</p>
            <list>
                <li>
                    从 <code>kotlin.Any</code>、<code>Kotlin.Enum</code>、<code>java.lang.Object</code> 或 
                    <code>java.lang.Enum</code> 继承的函数，例如 <code>equals</code>、<code>hashCode</code>、<code>toString</code>。
                </li>
                <li>
                    合成的（由编译器生成）且没有任何文档的函数，例如 
                    <code>dataClass.componentN</code> 或 <code>dataClass.copy</code>。
                </li>
            </list>
        <p>默认值：<code>true</code></p>
    </def>
    <def title="抑制继承成员">
        <p>是否抑制在给定类中未显式覆盖的继承成员。</p>
        <p>
            注意：这可以抑制 <code>equals</code>/<code>hashCode</code>/<code>toString</code> 等函数，
            但不能抑制 <code>dataClass.componentN</code> 和 <code>dataClass.copy</code> 等合成函数。
            为此请使用 <code>suppressObviousFunctions</code>。
        </p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="离线模式">
        <p>是否通过网络解析远程文件/链接。</p>
        <p>
            这包括用于生成外部文档链接的 package-list。
            例如，使标准库中的类可点击。
        </p>
        <p>
            将此设置为 <code>true</code> 在某些情况下可以显著加快构建时间，
            但也会降低文档质量和用户体验。例如，不
            解析来自你的依赖项（包括标准库）的类/成员链接。
        </p>
        <p>
            注意：你可以在本地缓存获取的文件，并将其作为
            本地路径提供给 Dokka。请参见 <code>externalDocumentationLinks</code> 部分。
        </p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="源代码目录">
        <p>
            要分析和文档化的源代码根目录。
            可接受的输入是目录和单个 <code>.kt</code> / <code>.java</code> 文件。
        </p>
        <p>默认值：<code>{project.compileSourceRoots}</code></p>
    </def>
    <def title="文档化可见性">
        <p>应文档化的可见性修饰符集。</p>
        <p>
            如果你想文档化 <code>protected</code>/<code>internal</code>/<code>private</code> 声明，
            以及如果你想排除 <code>public</code> 声明并仅文档化内部 API，可以使用此选项。
        </p>
        <p>可以按包进行配置。</p>
        <p>默认值：<code>PUBLIC</code></p>
    </def>
    <def title="报告未文档化">
        <p>
            是否发出关于可见的未文档化声明的警告，即经过 <code>documentedVisibilities</code> 
            和其他过滤器过滤后没有 KDocs 的声明。
        </p>
        <p>此设置与 <code>failOnWarning</code> 配合良好。</p>
        <p>这可以在包级别覆盖。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="跳过已弃用">
        <p>是否文档化使用 <code>@Deprecated</code> 注解的声明。</p>
        <p>这可以在项目/模块级别覆盖。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="跳过空包">
        <p>
            是否跳过在应用各种过滤器后不包含任何可见声明的包。
        </p>
        <p>
            例如，如果 <code>skipDeprecated</code> 设置为 <code>true</code>，并且你的包只包含
            已弃用的声明，则该包被视为空。
        </p>
        <p>默认值：<code>true</code></p>
    </def>
    <def title="抑制文件">
        <p>
            应抑制的目录或单个文件，这意味着来自这些文件的声明
            不会被文档化。
        </p>
    </def>
    <def title="jdk版本">
        <p>为 Java 类型生成外部文档链接时使用的 JDK 版本。</p>
        <p>
            例如，如果你在某个 public 声明签名中使用 <code>java.util.UUID</code>，
            并且此选项设置为 <code>8</code>，Dokka 会为它生成一个外部文档链接
            到 <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadoc</a>。
        </p>
        <p>默认值：JDK 8</p>
    </def>
    <def title="语言版本">
        <p>
            用于设置分析和 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            环境的 <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin 语言版本</a>。
        </p>
        <p>默认情况下，使用 Dokka 嵌入式编译器可用的最新语言版本。</p>
    </def>
    <def title="API 版本">
        <p>
            用于设置分析和 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample</a>
            环境的 <a href="https://kotlinlang.org/docs/compatibility-modes.html">Kotlin API 版本</a>。
        </p>
        <p>默认情况下，它从 <code>languageVersion</code> 推断。</p>
    </def>
    <def title="无标准库链接">
        <p>
            是否生成指向 Kotlin 标准库 API 参考文档的外部文档链接。
        </p>
        <p>注意：当 <code>noStdLibLink</code> 设置为 <code>false</code> 时，链接<b>会</b>生成。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="无 JDK 链接">
    <anchor name="includes"/>
        <p>是否生成指向 JDK Javadoc 的外部文档链接。</p>
        <p>JDK Javadoc 的版本由 <code>jdkVersion</code> 选项决定。</p>
        <p>注意：当 <code>noJdkLink</code> 设置为 <code>false</code> 时，链接<b>会</b>生成。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="包含">
        <p>
            包含 <a href="dokka-module-and-package-docs.md">模块和包文档</a>的 Markdown 文件列表。
        </p>
        <p>指定文件的内容将被解析并嵌入到文档中作为模块和包的描述。</p>
    </def>
    <def title="类路径">
        <p>用于分析和交互式示例的类路径。</p>
        <p>
            如果来自依赖项的某些类型未自动解析/识别，此选项会很有用。
            此选项接受 <code>.jar</code> 和 <code>.klib</code> 文件。
        </p>
        <p>默认值：<code>{project.compileClasspathElements}</code></p>
    </def>
    <def title="示例">
        <p>
            包含通过 <a href="https://kotlinlang.org/docs/kotlin-doc.html#sample-identifier">@sample KDoc 标签</a>引用的示例函数的目录或文件列表。
        </p>
    </def>
</deflist>

### 源链接配置

`sourceLinks` 配置块允许你为每个签名添加一个 `source` 链接，该链接指向带有特定行号的 `url`。（行号可通过设置 `lineSuffix` 进行配置）。

这有助于读者找到每个声明的源代码。

例如，请参见 `kotlinx.coroutines` 中 [`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html) 函数的文档。

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <sourceLinks>
            <link>
                <path>src</path>
                <url>https://github.com/kotlin/dokka/tree/master/src</url>
                <lineSuffix>#L</lineSuffix>
            </link>
        </sourceLinks>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="路径">
        <p>
            本地源代码目录的路径。路径必须是相对于当前模块根目录的相对路径。
        </p>
        <p>
            注意：只允许基于 Unix 的路径，Windows 风格的路径将抛出错误。
        </p>
    </def>
    <def title="网址">
        <p>
            文档读者可以访问的源代码托管服务的 URL，
            例如 GitHub、GitLab、Bitbucket 等。此 URL 用于生成
            声明的源代码链接。
        </p>
    </def>
    <def title="行号后缀">
        <p>
            用于将源代码行号附加到 URL 的后缀。这有助于读者不仅导航到文件，
            而且导航到声明的特定行号。
        </p>
        <p>
            数字本身将附加到指定的后缀。例如，如果此选项设置为 
            <code>#L</code> 且行号为 10，则生成的 URL 后缀为 <code>#L10</code>。
        </p>
        <p>
            常用服务使用的后缀：</p>
            <list>
            <li>GitHub：<code>#L</code></li>
            <li>GitLab：<code>#L</code></li>
            <li>Bitbucket：<code>#lines-</code></li>
            </list>
    </def>
</deflist>

### 外部文档链接配置

`externalDocumentationLinks` 块允许创建指向你的依赖项的外部托管文档的链接。

例如，如果你正在使用来自 `kotlinx.serialization` 的类型，默认情况下它们在你的文档中是不可点击的，就好像它们未解析一样。然而，由于 `kotlinx.serialization` 的 API 参考文档是由 Dokka 构建并[发布在 kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/) 上的，你可以为其配置外部文档链接。这样，Dokka 就可以为库中的类型生成链接，使它们成功解析并可点击。

默认情况下，Kotlin 标准库和 JDK 的外部文档链接已配置。

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <externalDocumentationLinks>
            <link>
                <url>https://kotlinlang.org/api/kotlinx.serialization/</url>
                <packageListUrl>file:/${project.basedir}/serialization.package.list</packageListUrl>
            </link>
        </externalDocumentationLinks>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="网址">
        <p>要链接的文档的根 URL。它<b>必须</b>包含尾部斜杠。</p>
        <p>
            Dokka 会尽力自动查找给定 URL 的 <code>package-list</code>，
            并将声明链接在一起。
        </p>
        <p>
            如果自动解析失败或者你想使用本地缓存的文件，
            请考虑设置 <code>packageListUrl</code> 选项。
        </p>
    </def>
    <def title="包列表网址">
        <p>
            <code>package-list</code> 的确切位置。这是不依赖 Dokka
            自动解析的替代方法。
        </p>
        <p>
            包列表包含有关文档和项目本身的信息，
            例如模块和包名称。
        </p>
        <p>这也可以是本地缓存文件，以避免网络调用。</p>
    </def>
</deflist>

### 包选项

`perPackageOptions` 配置块允许为由 `matchingRegex` 匹配的特定包设置一些选项。

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <perPackageOptions>
            <packageOptions>
                <matchingRegex>.*api.*</matchingRegex>
                <suppress>false</suppress>
                <reportUndocumented>false</reportUndocumented>
                <skipDeprecated>false</skipDeprecated>
                <documentedVisibilities>
                    <visibility>PUBLIC</visibility>
                    <visibility>PRIVATE</visibility>
                    <visibility>PROTECTED</visibility>
                    <visibility>INTERNAL</visibility>
                    <visibility>PACKAGE</visibility>
                </documentedVisibilities>
            </packageOptions>
        </perPackageOptions>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="匹配正则表达式">
        <p>用于匹配包的正则表达式。</p>
        <p>默认值：<code>.*</code></p>
 </def>
    <def title="抑制">
        <p>生成文档时是否应跳过此包。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="文档化可见性">
        <p>应文档化的可见性修饰符集。</p>
        <p>
            如果你想文档化此包内的 <code>protected</code>/<code>internal</code>/<code>private</code> 声明，
            以及如果你想排除 <code>public</code> 声明并仅文档化内部 API，可以使用此选项。
        </p>
        <p>默认值：<code>PUBLIC</code></p>
    </def>
    <def title="跳过已弃用">
        <p>是否文档化使用 <code>@Deprecated</code> 注解的声明。</p>
        <p>这可以在项目/模块级别设置。</p>
        <p>默认值：<code>false</code></p>
    </def>
    <def title="报告未文档化">
        <p>
            是否发出关于可见的未文档化声明的警告，即经过 <code>documentedVisibilities</code> 
            和其他过滤器过滤后没有 KDocs 的声明。
        </p>
        <p>此设置与 <code>failOnWarning</code> 配合良好。</p>
        <p>默认值：<code>false</code></p>
    </def>
</deflist>

### 完整配置

下面你可以看到同时应用的所有可能配置选项。

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <skip>false</skip>
        <moduleName>${project.artifactId}</moduleName>
        <outputDir>${project.basedir}/target/documentation</outputDir>
        <failOnWarning>false</failOnWarning>
        <suppressObviousFunctions>true</suppressObviousFunctions>
        <suppressInheritedMembers>false</suppressInheritedMembers>
        <offlineMode>false</offlineMode>
        <sourceDirectories>
            <dir>${project.basedir}/src</dir>
        </sourceDirectories>
        <documentedVisibilities>
            <visibility>PUBLIC</visibility>
            <visibility>PRIVATE</visibility>
            <visibility>PROTECTED</visibility>
            <visibility>INTERNAL</visibility>
            <visibility>PACKAGE</visibility>
        </documentedVisibilities>
        <reportUndocumented>false</reportUndocumented>
        <skipDeprecated>false</skipDeprecated>
        <skipEmptyPackages>true</skipEmptyPackages>
        <suppressedFiles>
            <file>/path/to/dir</file>
            <file>/path/to/file</file>
        </suppressedFiles>
        <jdkVersion>8</jdkVersion>
        <languageVersion>1.7</languageVersion>
        <apiVersion>1.7</apiVersion>
        <noStdlibLink>false</noStdlibLink>
        <noJdkLink>false</noJdkLink>
        <includes>
            <include>packages.md</include>
            <include>extra.md</include>
        </includes>
        <classpath>${project.compileClasspathElements}</classpath>
        <samples>
            <dir>${project.basedir}/samples</dir>
        </samples>
        <sourceLinks>
            <link>
                <path>src</path>
                <url>https://github.com/kotlin/dokka/tree/master/src</url>
                <lineSuffix>#L</lineSuffix>
            </link>
        </sourceLinks>
        <externalDocumentationLinks>
            <link>
                <url>https://kotlinlang.org/api/core/kotlin-stdlib/</url>
                <packageListUrl>file:/${project.basedir}/stdlib.package.list</packageListUrl>
            </link>
        </externalDocumentationLinks>
        <perPackageOptions>
            <packageOptions>
                <matchingRegex>.*api.*</matchingRegex>
                <suppress>false</suppress>
                <reportUndocumented>false</reportUndocumented>
                <skipDeprecated>false</skipDeprecated>
                <documentedVisibilities>
                    <visibility>PUBLIC</visibility>
                    <visibility>PRIVATE</visibility>
                    <visibility>PROTECTED</visibility>
                    <visibility>INTERNAL</visibility>
                    <visibility>PACKAGE</visibility>
                </documentedVisibilities>
            </packageOptions>
        </perPackageOptions>
    </configuration>
</plugin>