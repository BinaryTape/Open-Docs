[//]: # (title: Dropwizard metrics)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="DropwizardMetrics"/>
<var name="package_name" value="io.ktor.server.metrics.dropwizard"/>
<var name="artifact_name" value="ktor-server-metrics"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="dropwizard-metrics"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在不需額外運行時或虛擬機器的情況下運行伺服器。">原生伺服器</Links>支援</b>: ✖️
</p>
</tldr>

<link-summary>%plugin_name% 插件讓您能夠配置 Metrics 庫，以獲取關於伺服器和傳入請求的有用資訊。</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server-metrics/io.ktor.server.metrics.dropwizard/-dropwizard-metrics.html) 插件讓您能夠配置 [Metrics](http://metrics.dropwizard.io/) 庫，以獲取關於伺服器和傳入請求的有用資訊。

## 添加依賴項 {id="add_dependencies"}
若要啟用 `%plugin_name%`，您需要將以下構件包含在構建腳本中：
* 添加 `%artifact_name%` 依賴項：

  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                  &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>

* 或者，添加特定報告器所需的依賴項。以下範例展示了如何添加透過 JMX 報告指標所需的構件：

  <var name="group_id" value="io.dropwizard.metrics"/>
  <var name="artifact_name" value="metrics-jmx"/>
  <var name="version" value="dropwizard_version"/>
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
  
  您可以將 `$dropwizard_version` 替換為 `metrics-jmx` 構件所需的版本，例如 `%dropwizard_version%`。

## 安裝 %plugin_name% {id="install_plugin"}

<p>
    若要將 <code>%plugin_name%</code> 插件<a href="#install">安裝</a>到應用程式中，
    請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織您的應用程式。">模組</Links>中的 <code>install</code> 函數。
    以下程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內部，該 <code>module</code> 是 <code>Application</code> 類別的一個擴展函數。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>

## 配置 %plugin_name% {id="configure_plugin"}

`%plugin_name%` 允許您使用任何支援的 [Metric 報告器](http://metrics.dropwizard.io/)，透過 `registry` 屬性。讓我們看看如何配置 SLF4J 和 JMX 報告器。

### SLF4J 報告器 {id="slf4j"}

SLF4J 報告器允許您定期將報告發送到 SLF4J 支援的任何輸出。例如，若要每 10 秒輸出一次指標，您可以：

```kotlin
install(DropwizardMetrics) {
    Slf4jReporter.forRegistry(registry)
        .outputTo(this@module.log)
        .convertRatesTo(TimeUnit.SECONDS)
        .convertDurationsTo(TimeUnit.MILLISECONDS)
        .build()
        .start(10, TimeUnit.SECONDS)
}
```

您可以在此處找到完整範例：[dropwizard-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/dropwizard-metrics)。

如果您運行應用程式並開啟 [http://0.0.0.0:8080](http://0.0.0.0:8080)，輸出將會像這樣：

```Bash
[DefaultDispatcher-worker-1] INFO  Application - Responding at http://0.0.0.0:8080
... type=COUNTER, name=ktor.calls.active, count=0
... type=METER, name=ktor.calls./(method:GET).200, count=6, m1_rate=1.2, m5_rate=1.2, m15_rate=1.2, mean_rate=0.98655785084844, rate_unit=events/second
... type=METER, name=ktor.calls./(method:GET).meter, count=6, m1_rate=1.2, m5_rate=1.2, m15_rate=1.2, mean_rate=0.9841134429134598, rate_unit=events/second
... type=METER, name=ktor.calls.exceptions, count=0, m1_rate=0.0, m5_rate=0.0, m15_rate=0.0, mean_rate=0.0, rate_unit=events/second
... type=METER, name=ktor.calls.status.200, count=6, m1_rate=1.2, m5_rate=1.2, m15_rate=1.2, mean_rate=0.9866015088545449, rate_unit=events/second
... type=TIMER, name=ktor.calls./(method:GET).timer, count=6, min=0.359683, max=14.213046, mean=2.691307542732234, stddev=5.099546889849414, p50=0.400967, p75=0.618972, p95=14.213046, p98=14.213046, p99=14.213046, p999=14.213046, m1_rate=1.2, m5_rate=1.2, m15_rate=1.2, mean_rate=0.9830677128229028, rate_unit=events/second, duration_unit=milliseconds
... type=TIMER, name=ktor.calls.duration, count=6, min=0.732149, max=33.735719, mean=6.238046092985701, stddev=12.169258340009847, p50=0.778864, p75=1.050454, p95=33.735719, p98=33.735719, p99=33.735719, p999=33.735719, m1_rate=0.2, m5_rate=0.2, m15_rate=0.2, mean_rate=0.6040311229887146, rate_unit=events/second, duration_unit=milliseconds
```

### JMX 報告器 {id="jmx"}

JMX 報告器允許您將所有指標暴露給 JMX，讓您能夠使用 `jconsole` 查看這些指標。

```kotlin
install(DropwizardMetrics) {
    JmxReporter.forRegistry(registry)
        .convertRatesTo(TimeUnit.SECONDS)
        .convertDurationsTo(TimeUnit.MILLISECONDS)
        .build()
        .start()
}
```

您可以在此處找到完整範例：[dropwizard-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/dropwizard-metrics)。

如果您運行應用程式並使用 [JConsole](https://docs.oracle.com/en/java/javase/17/management/using-jconsole.html) 連接到其處理程序，指標將會像這樣：

![Ktor 指標：JMX](jmx.png){width="758"}

## 暴露的指標 {id="exposed-metrics"}

`%plugin_name%` 暴露以下指標：

- [全域指標](#global-metrics)，包括 Ktor 特有指標和 [JVM 指標](#jvm-metrics)。
- [端點指標](#endpoint-metrics)。

### 全域指標 {id="global-metrics"}

全域指標包括以下 Ktor 特有指標：

* `ktor.calls.active`:`Count` - 未完成的活躍請求數量。
* `ktor.calls.duration` - 關於呼叫持續時間的資訊。
* `ktor.calls.exceptions` - 關於異常數量的資訊。
* `ktor.calls.status.NNN` - 關於特定 HTTP 狀態碼 `NNN` 出現次數的資訊。

請注意，指標名稱以 `ktor.calls` 前綴開頭。您可以使用 `baseName` 屬性自訂它：

```kotlin
install(DropwizardMetrics) {
    baseName = "my.prefix"
}
```

### 每端點指標 {id="endpoint-metrics"}

* `"/uri(method:VERB).NNN"` - 關於此路徑和動詞的特定 HTTP 狀態碼 `NNN` 出現次數的資訊。
* `"/uri(method:VERB).meter"` - 關於此路徑和動詞的呼叫次數的資訊。
* `"/uri(method:VERB).timer"` - 關於此端點持續時間的資訊。

### JVM 指標 {id="jvm-metrics"}

除了 HTTP 指標之外，Ktor 還公開了一組用於監控 JVM 的指標。您可以使用 `registerJvmMetricSets` 屬性禁用這些指標：

```kotlin
install(DropwizardMetrics) {
    registerJvmMetricSets = false
}
```

您可以在此處找到完整範例：[dropwizard-metrics](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/dropwizard-metrics)。