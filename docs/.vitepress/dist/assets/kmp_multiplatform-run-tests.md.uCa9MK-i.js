import{_ as l,a as e,b as r,c as o,d as h,e as k,f as c}from"./chunks/multiplatform-test-report.CawuKTkU.js";import{_ as d,C as p,c as u,o as g,j as n,G as a,ag as E,a as m,w as y}from"./chunks/framework.Bksy39di.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"kmp/multiplatform-run-tests.md","filePath":"kmp/multiplatform-run-tests.md","lastUpdated":1755516278000}'),F={name:"kmp/multiplatform-run-tests.md"};function C(q,s,v,f,b,A){const i=p("secondary-label"),t=p("tldr");return g(),u("div",null,[s[1]||(s[1]=n("h1",{id:"测试您的多平台应用-–-教程",tabindex:"-1"},[m("测试您的多平台应用 – 教程 "),n("a",{class:"header-anchor",href:"#测试您的多平台应用-–-教程","aria-label":'Permalink to "测试您的多平台应用 – 教程"'},"​")],-1)),a(i,{ref:"IntelliJ IDEA"},null,512),a(i,{ref:"Android Studio"},null,512),a(t,null,{default:y(()=>s[0]||(s[0]=[n("p",null,"本教程使用 IntelliJ IDEA，但您也可以在 Android Studio 中遵循此教程 – 两个 IDE 都共享相同的核心功能和 Kotlin Multiplatform 支持。",-1)])),_:1}),s[2]||(s[2]=E('<p>在本教程中，您将学习如何在 Kotlin Multiplatform 应用程序中创建、配置和运行测试。</p><p>多平台项目的测试可以分为两类：</p><ul><li>公共代码的测试。这些测试可以使用任何支持的框架在任何平台上运行。</li><li>平台特有的代码的测试。这些测试对于测试平台特有逻辑至关重要。它们使用平台特有的框架，并可以受益于其额外的特性，例如更丰富的 API 和更广泛的断言范围。</li></ul><p>这两类都在多平台项目中受支持。本教程将首先向您展示如何在简单的 Kotlin Multiplatform 项目中设置、创建和运行公共代码的单元测试。然后，您将使用一个更复杂的示例，它需要同时测试公共代码和平台特有的代码。</p><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>本教程假设您熟悉： * Kotlin Multiplatform 项目的布局。如果不是，请在开始前完成<a href="./multiplatform-create-first-app">此教程</a>。 * 流行的单元测试框架（例如 <a href="https://junit.org/junit5/" target="_blank" rel="noreferrer">JUnit</a>）的基础知识。</p></div><h2 id="测试一个简单的多平台项目" tabindex="-1">测试一个简单的多平台项目 <a class="header-anchor" href="#测试一个简单的多平台项目" aria-label="Permalink to &quot;测试一个简单的多平台项目&quot;">​</a></h2><h3 id="创建项目" tabindex="-1">创建项目 <a class="header-anchor" href="#创建项目" aria-label="Permalink to &quot;创建项目&quot;">​</a></h3><ol><li><p>在<a href="./quickstart">快速入门</a>中，完成<a href="./quickstart#set-up-the-environment">设置 Kotlin Multiplatform 开发环境</a>的说明。</p></li><li><p>在 IntelliJ IDEA 中，选择 <strong>文件</strong> | <strong>新建</strong> | <strong>项目</strong>。</p></li><li><p>在左侧面板中，选择 <strong>Kotlin Multiplatform</strong>。</p></li><li><p>在 <strong>新建项目</strong> 窗口中指定以下字段：</p><ul><li><strong>Name</strong>: KotlinProject</li><li><strong>Group</strong>: kmp.project.demo</li><li><strong>Artifact</strong>: kotlinproject</li><li><strong>JDK</strong>: Amazon Corretto version 17<div class="note custom-block"><p class="custom-block-title">NOTE</p><p>此 JDK 版本是后续您添加的测试成功运行所必需的。</p></div></li></ul></li><li><p>选择 <strong>Android</strong> 目标。</p><ul><li>如果您使用的是 Mac，也选择 <strong>iOS</strong>。确保选中 <strong>Do not share UI</strong> 选项。</li></ul></li><li><p>取消选择 <strong>Include tests</strong>，然后点击 <strong>Create</strong>。</p></li></ol><p><img src="'+l+`" alt="Create simple multiplatform project" width="800"></p><h3 id="编写代码" tabindex="-1">编写代码 <a class="header-anchor" href="#编写代码" aria-label="Permalink to &quot;编写代码&quot;">​</a></h3><p>在 <code>shared/src/commonMain/kotlin</code> 目录中，创建一个新的 <code>common.example.search</code> 目录。 在此目录中，创建一个 Kotlin 文件 <code>Grep.kt</code>，其中包含以下函数：</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> grep</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(lines: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">List</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&lt;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">&gt;, pattern: </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">, action: (</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">String</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) -&gt; </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Unit</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> regex </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> pattern.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">toRegex</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    lines.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">filter</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(regex::</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">containsMatchIn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">forEach</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(action)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><p>此函数旨在模拟 <a href="https://en.wikipedia.org/wiki/Grep" target="_blank" rel="noreferrer">UNIX <code>grep</code> 命令</a>。在这里，函数接受文本行、用作正则表达式的模式，以及一个每当一行匹配该模式时都会调用的函数。</p><h3 id="添加测试" tabindex="-1">添加测试 <a class="header-anchor" href="#添加测试" aria-label="Permalink to &quot;添加测试&quot;">​</a></h3><p>现在，让我们测试公共代码。一个重要的部分是公共测试的源代码集，它将 <a href="https://kotlinlang.org/api/latest/kotlin.test/" target="_blank" rel="noreferrer"><code>kotlin.test</code></a> API 库作为依赖项。</p><ol><li><p>在 <code>shared/build.gradle.kts</code> 文件中，检测是否存在对 <code>kotlin.test</code> 库的依赖项：</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"></span></code></pre></div></li></ol><p>sourceSets { //... commonTest.dependencies { implementation(libs.kotlin.test) } }</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>2.  \`commonTest\` 源代码集存储所有公共测试。您需要在项目中创建一个同名目录：</span></span>
<span class="line"><span></span></span>
<span class="line"><span> 1.  右键点击 \`shared/src\` 目录，然后选择 **新建 | 目录**。IDE 会提供选项列表。</span></span>
<span class="line"><span> 2.  开始输入 \`commonTest/kotlin\` 路径以缩小选择范围，然后从列表中选择它：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>   ![Creating common test directory](create-common-test-dir.png){width=350}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3.  在 \`commonTest/kotlin\` 目录中，创建一个新的 \`common.example.search\` 包。</span></span>
<span class="line"><span>4.  在此包中，创建 \`Grep.kt\` 文件并使用以下单元测试更新它：</span></span>
<span class="line"><span></span></span>
<span class="line"><span> \`\`\`kotlin</span></span>
<span class="line"><span> import kotlin.test.Test</span></span>
<span class="line"><span> import kotlin.test.assertContains</span></span>
<span class="line"><span> import kotlin.test.assertEquals</span></span>
<span class="line"><span> </span></span>
<span class="line"><span> class GrepTest {</span></span>
<span class="line"><span>     companion object {</span></span>
<span class="line"><span>         val sampleData = listOf(</span></span>
<span class="line"><span>             &quot;123 abc&quot;,</span></span>
<span class="line"><span>             &quot;abc 123&quot;,</span></span>
<span class="line"><span>             &quot;123 ABC&quot;,</span></span>
<span class="line"><span>             &quot;ABC 123&quot;</span></span>
<span class="line"><span>         )</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>     @Test</span></span>
<span class="line"><span>     fun shouldFindMatches() {</span></span>
<span class="line"><span>         val results = mutableListOf&lt;String&gt;()</span></span>
<span class="line"><span>         grep(sampleData, &quot;[a-z]+&quot;) {</span></span>
<span class="line"><span>             results.add(it)</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>         assertEquals(2, results.size)</span></span>
<span class="line"><span>         for (result in results) {</span></span>
<span class="line"><span>             assertContains(result, &quot;abc&quot;)</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> \`\`\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>如您所见，导入的注解和断言既不是平台特有的，也不是框架特有的。当您稍后运行此测试时，平台特有的框架将提供测试运行器。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### 探查 \`kotlin.test\` API {initial-collapse-state=&quot;collapsed&quot; collapsible=&quot;true&quot;}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>[\`kotlin.test\`](https://kotlinlang.org/api/latest/kotlin.test/) 库提供了平台无关的注解和断言供您在测试中使用。注解（例如 \`Test\`）会映射到所选框架提供的注解或其最接近的等效项。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>断言通过 [\`Asserter\` 接口](https://kotlinlang.org/api/latest/kotlin.test/kotlin.test/-asserter/)的实现来执行。此接口定义了测试中常用的各种检测。API 有一个默认实现，但通常您将使用框架特有的实现。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>例如，JUnit 4、JUnit 5 和 TestNG 框架都受 JVM 支持。在 Android 上，对 \`assertEquals()\` 的调用可能会导致对 \`asserter.assertEquals()\` 的调用，其中 \`asserter\` 对象是 \`JUnit4Asserter\` 的实例。在 iOS 上，\`Asserter\` 类型的默认实现与 Kotlin/Native 测试运行器结合使用。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 运行测试</span></span>
<span class="line"><span></span></span>
<span class="line"><span>您可以通过运行以下方式执行测试：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>*   使用边栏中的 **运行** 图标运行 \`shouldFindMatches()\` 测试函数。</span></span>
<span class="line"><span>*   使用其右键菜单运行测试文件。</span></span>
<span class="line"><span>*   使用边栏中的 **运行** 图标运行 \`GrepTest\` 测试类。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>还有一个方便的快捷键 &lt;shortcut&gt;⌃ ⇧ F10&lt;/shortcut&gt;/&lt;shortcut&gt;Ctrl+Shift+F10&lt;/shortcut&gt;。</span></span>
<span class="line"><span>无论您选择哪个选项，都会看到一个可供运行测试的目标列表：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![Run test task](run-test-tasks.png){width=300}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>对于 \`android\` 选项，测试使用 JUnit 4 运行。对于 \`iosSimulatorArm64\`，Kotlin 编译器会检测测试注解并创建一个由 Kotlin/Native 自己的测试运行器执行的*测试二进制文件*。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>以下是成功测试运行生成的输出示例：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>![Test output](run-test-results.png){width=700}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 处理更复杂的项目</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 编写公共代码的测试</span></span>
<span class="line"><span></span></span>
<span class="line"><span>您已经为 \`grep()\` 函数的公共代码创建了一个测试。现在，让我们考虑一个更高级的公共代码测试，使用 \`CurrentRuntime\` 类。此类包含代码执行所在平台的详细信息。例如，对于在本地 JVM 上运行的 Android 单元测试，它可能具有 &quot;OpenJDK&quot; 和 &quot;17.0&quot; 的值。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`CurrentRuntime\` 的实例应使用平台名称和版本（字符串形式）创建，其中版本是可选的。当版本存在时，如果可用，您只需要字符串开头的数字。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>1.  在 \`commonMain/kotlin\` 目录中，创建一个新的 \`org.kmp.testing\` 目录。</span></span>
<span class="line"><span>2.  在此目录中，创建 \`CurrentRuntime.kt\` 文件并使用以下实现更新它：</span></span>
<span class="line"><span></span></span>
<span class="line"><span> \`\`\`kotlin</span></span>
<span class="line"><span> class CurrentRuntime(val name: String, rawVersion: String?) {</span></span>
<span class="line"><span>     companion object {</span></span>
<span class="line"><span>         val versionRegex = Regex(&quot;^[0-9]+(\\\\.[0-9]+)?&quot;)</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>     val version = parseVersion(rawVersion)</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>     override fun toString() = &quot;$name version $version&quot;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>     private fun parseVersion(rawVersion: String?): String {</span></span>
<span class="line"><span>         val result = rawVersion?.let { versionRegex.find(it) }</span></span>
<span class="line"><span>         return result?.value ?: &quot;unknown&quot;</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> \`\`\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>3.  在 \`commonTest/kotlin\` 目录中，创建一个新的 \`org.kmp.testing\` 包。</span></span>
<span class="line"><span>4.  在此包中，创建 \`CurrentRuntimeTest.kt\` 文件并使用以下平台和框架无关的测试更新它：</span></span>
<span class="line"><span></span></span>
<span class="line"><span> \`\`\`kotlin</span></span>
<span class="line"><span> import kotlin.test.Test</span></span>
<span class="line"><span> import kotlin.test.assertEquals</span></span>
<span class="line"><span></span></span>
<span class="line"><span> class CurrentRuntimeTest {</span></span>
<span class="line"><span>     @Test</span></span>
<span class="line"><span>     fun shouldDisplayDetails() {</span></span>
<span class="line"><span>         val runtime = CurrentRuntime(&quot;MyRuntime&quot;, &quot;1.1&quot;)</span></span>
<span class="line"><span>         assertEquals(&quot;MyRuntime version 1.1&quot;, runtime.toString())</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>     @Test</span></span>
<span class="line"><span>     fun shouldHandleNullVersion() {</span></span>
<span class="line"><span>         val runtime = CurrentRuntime(&quot;MyRuntime&quot;, null)</span></span>
<span class="line"><span>         assertEquals(&quot;MyRuntime version unknown&quot;, runtime.toString())</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>     @Test</span></span>
<span class="line"><span>     fun shouldParseNumberFromVersionString() {</span></span>
<span class="line"><span>         val runtime = CurrentRuntime(&quot;MyRuntime&quot;, &quot;1.2 Alpha Experimental&quot;)</span></span>
<span class="line"><span>         assertEquals(&quot;MyRuntime version 1.2&quot;, runtime.toString())</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>     @Test</span></span>
<span class="line"><span>     fun shouldHandleMissingVersion() {</span></span>
<span class="line"><span>         val runtime = CurrentRuntime(&quot;MyRuntime&quot;, &quot;Alpha Experimental&quot;)</span></span>
<span class="line"><span>         assertEquals(&quot;MyRuntime version unknown&quot;, runtime.toString())</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> \`\`\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>您可以使用[IDE 中可用的任何方式](#run-tests)运行此测试。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### 添加平台特有的测试</span></span>
<span class="line"><span></span></span>
<span class="line"><span>::: note</span></span>
<span class="line"><span>这里，为了简洁和简单，使用了 [expected 和 actual 声明机制](multiplatform-connect-to-apis.md)。在更复杂的代码中，更好的方法是使用接口和工厂函数。</span></span>
<span class="line"><span>:::</span></span>
<span class="line"><span>现在您已经有了编写公共代码测试的经验，接下来让我们探查如何编写 Android 和 iOS 的平台特有测试。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>要创建 \`CurrentRuntime\` 的实例，请在公共 \`CurrentRuntime.kt\` 文件中声明一个函数，如下所示：</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`kotlin</span></span>
<span class="line"><span>expect fun determineCurrentRuntime(): CurrentRuntime</span></span></code></pre></div><p>该函数应该为每个支持的平台提供单独的实现。否则，构建将失败。除了在每个平台上实现此函数外，您还应该提供测试。让我们为 Android 和 iOS 创建它们。</p><h4 id="对于-android" tabindex="-1">对于 Android <a class="header-anchor" href="#对于-android" aria-label="Permalink to &quot;对于 Android&quot;">​</a></h4><ol><li><p>在 <code>androidMain/kotlin</code> 目录中，创建一个新的 <code>org.kmp.testing</code> 包。</p></li><li><p>在此包中，创建 <code>AndroidRuntime.kt</code> 文件并使用预期的 <code>determineCurrentRuntime()</code> 函数的实际实现更新它：</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">actual </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> determineCurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(): </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">CurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> name </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> System.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getProperty</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;java.vm.name&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) ?: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;Android&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> version </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> System.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">getProperty</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;java.version&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> CurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(name, version)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></li><li><p>在 <code>shared/src</code> 目录内创建一个测试目录：</p><ol><li>右键点击 <code>shared/src</code> 目录，然后选择 <strong>新建 | 目录</strong>。IDE 会提供选项列表。</li><li>开始输入 <code>androidUnitTest/kotlin</code> 路径以缩小选择范围，然后从列表中选择它：</li></ol></li></ol><p><img src="`+e+`" alt="Creating Android test directory" width="350"></p><ol start="4"><li><p>在 <code>kotlin</code> 目录中，创建一个新的 <code>org.kmp.testing</code> 包。</p></li><li><p>在此包中，创建 <code>AndroidRuntimeTest.kt</code> 文件并使用以下 Android 测试更新它：</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.test.Test</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.test.assertContains</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.test.assertEquals</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> AndroidRuntimeTest</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    @Test</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> shouldDetectAndroid</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> runtime </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> determineCurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        assertContains</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(runtime.name, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;OpenJDK&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        assertEquals</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(runtime.version, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;17.0&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><div class="note custom-block"><p class="custom-block-title">NOTE</p><p>如果您在本教程开始时选择了不同的 JDK 版本，您可能需要更改 <code>name</code> 和 <code>version</code> 以使测试成功运行。</p></div></li></ol><p>Android 特有的测试在本地 JVM 上运行可能看起来很奇怪。这是因为这些测试作为本地单元测试在当前机器上运行。如 <a href="https://developer.android.com/studio/test/test-in-android-studio" target="_blank" rel="noreferrer">Android Studio 文档</a>所述，这些测试与在设备或模拟器上运行的插桩测试不同。</p><p>您可以向您的项目添加其他类型的测试。要了解有关插桩测试的信息，请参阅此 <a href="https://touchlab.co/understanding-and-configuring-your-kmm-test-suite/" target="_blank" rel="noreferrer">Touchlab 指南</a>。</p><h4 id="对于-ios" tabindex="-1">对于 iOS <a class="header-anchor" href="#对于-ios" aria-label="Permalink to &quot;对于 iOS&quot;">​</a></h4><ol><li><p>在 <code>iosMain/kotlin</code> 目录中，创建一个新的 <code>org.kmp.testing</code> 目录。</p></li><li><p>在此目录中，创建 <code>IOSRuntime.kt</code> 文件并使用预期的 <code>determineCurrentRuntime()</code> 函数的实际实现更新它：</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.experimental.ExperimentalNativeApi</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.native.Platform</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">@OptIn</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(ExperimentalNativeApi::</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">class</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">actual </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> determineCurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(): </span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">CurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> name </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Platform.osFamily.name.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">lowercase</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    return</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> CurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(name, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></li><li><p>在 <code>shared/src</code> 目录中创建一个新目录：</p><ol><li>右键点击 <code>shared/src</code> 目录，然后选择 <strong>新建 | 目录</strong>。IDE 会提供选项列表。</li><li>开始输入 <code>iosTest/kotlin</code> 路径以缩小选择范围，然后从列表中选择它：</li></ol></li></ol><p><img src="`+r+`" alt="Creating iOS test directory" width="350"></p><ol start="4"><li><p>在 <code>iosTest/kotlin</code> 目录中，创建一个新的 <code>org.kmp.testing</code> 目录。</p></li><li><p>在此目录中，创建 <code>IOSRuntimeTest.kt</code> 文件并使用以下 iOS 测试更新它：</p><div class="language-kotlin vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">kotlin</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.test.Test</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">import</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> kotlin.test.assertEquals</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> IOSRuntimeTest</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">    @Test</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    fun</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> shouldDetectOS</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">() {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        val</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> runtime </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> determineCurrentRuntime</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">()</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        assertEquals</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(runtime.name, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;ios&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">        assertEquals</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(runtime.version, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">&quot;unknown&quot;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div></li></ol><h3 id="运行多个测试并分析报告" tabindex="-1">运行多个测试并分析报告 <a class="header-anchor" href="#运行多个测试并分析报告" aria-label="Permalink to &quot;运行多个测试并分析报告&quot;">​</a></h3><p>在此阶段，您已经拥有公共、Android 和 iOS 实现的代码及其测试。 您的项目中的目录结构应如下所示：</p><p><img src="`+o+'" alt="Whole project structure" width="300"></p><p>您可以从右键菜单运行单个测试或使用快捷键。另一个选项是使用 Gradle 任务。例如，如果您运行 <code>allTests</code> Gradle 任务，项目中的每个测试都将使用相应的测试运行器运行：</p><p><img src="'+h+'" alt="Gradle test tasks" width="700"></p><p>当您运行测试时，除了 IDE 中的输出外，还会生成 HTML 报告。您可以在 <code>shared/build/reports/tests</code> 目录中找到它们：</p><p><img src="'+k+'" alt="HTML reports for multiplatform tests" width="300"></p><p>运行 <code>allTests</code> 任务并检查其生成的报告：</p><ul><li><code>allTests/index.html</code> 文件包含公共测试和 iOS 测试的组合报告 （iOS 测试依赖于公共测试，并在其后运行）。</li><li><code>testDebugUnitTest</code> 和 <code>testReleaseUnitTest</code> 文件夹包含两个默认 Android 构建变体的报告。 （目前，Android 测试报告不会自动与 <code>allTests</code> 报告合并。）</li></ul><p><img src="'+c+'" alt="HTML report for multiplatform tests" width="700"></p><h2 id="在多平台项目中使用测试的规则" tabindex="-1">在多平台项目中使用测试的规则 <a class="header-anchor" href="#在多平台项目中使用测试的规则" aria-label="Permalink to &quot;在多平台项目中使用测试的规则&quot;">​</a></h2><p>您现在已经创建、配置和执行了 Kotlin Multiplatform 应用程序中的测试。 在您未来的项目中使用测试时，请记住：</p><ul><li>编写公共代码的测试时，只使用多平台库，例如 <a href="https://kotlinlang.org/api/latest/kotlin.test/" target="_blank" rel="noreferrer">kotlin.test</a>。将依赖项添加到 <code>commonTest</code> 源代码集。</li><li><code>kotlin.test</code> API 中的 <code>Asserter</code> 类型应该只被间接使用。 尽管 <code>Asserter</code> 实例是可见的，但您无需在测试中使用它。</li><li>始终遵守测试库 API。幸运的是， 编译器和 IDE 会阻止您使用框架特有的功能。</li><li>虽然在 <code>commonTest</code> 中运行测试使用哪个框架都无所谓，但最好使用您打算使用的每个框架运行测试，以检测您的开发环境是否已正确设置。</li><li>考虑物理差异。例如，滚动惯性和摩擦值因平台和设备而异， 因此设置相同的滚动速度可能会导致不同的滚动位置。请务必在目标平台上测试您的组件，以确保预期行为。</li><li>编写平台特有的代码的测试时，您可以使用相应框架的功能，例如 注解和扩展。</li><li>您可以既可以从 IDE 运行测试，也可以使用 Gradle 任务运行测试。</li><li>当您运行测试时，HTML 测试报告会自动生成。</li></ul><h2 id="接下来是什么" tabindex="-1">接下来是什么？ <a class="header-anchor" href="#接下来是什么" aria-label="Permalink to &quot;接下来是什么？&quot;">​</a></h2><ul><li>探查多平台项目的布局：<a href="./multiplatform-discover-project">理解多平台项目结构</a>。</li><li>了解 <a href="https://kotest.io/" target="_blank" rel="noreferrer">Kotest</a>，这是 Kotlin 生态系统提供的另一个多平台测试框架。 Kotest 允许以多种风格编写测试，并支持对常规测试的补充方法。 这包括<a href="https://kotest.io/docs/framework/datatesting/data-driven-testing.html" target="_blank" rel="noreferrer">数据驱动的</a> 和<a href="https://kotest.io/docs/proptest/property-based-testing.html" target="_blank" rel="noreferrer">基于属性的</a>测试。</li></ul>',44))])}const _=d(F,[["render",C]]);export{B as __pageData,_ as default};
