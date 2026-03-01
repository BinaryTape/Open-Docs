[//]: # (title: 相依項註冊)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必要的相依項</b>：<code>io.ktor:ktor-server-di</code>
</p>
<var name="example_name" value="server-di"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Ktor 的 [相依注入 (DI)](server-dependency-injection.md) 容器需要知道如何建立您的應用程式所相依的物件。此程序稱為相依項註冊。

### 基本相依項註冊

基本相依項註冊是在程式碼中完成的，通常位於 `Application` 模組內，並使用 `dependencies {}` 區塊。

您可以透過提供 [Lambda 運算式](#lambda-registration)、[函式參考](#function-reference)、[類別參考](#class-reference) 或 [建構函式參考](#constructor-reference) 來註冊相依項：

#### 使用 Lambda 運算式 {id="lambda-registration"}

當您想要完全控制執行個體的建立方式時，請使用 Lambda 運算式：

```kotlin
dependencies {
    provide<GreetingService> { GreetingServiceImpl() }
}
```
這會註冊一個 `GreetingService` 的提供者。每當請求 `GreetingService` 時，都會執行該 Lambda 運算式來建立執行個體。

#### 使用建構函式參考 {id="constructor-reference"}

如果一個類別可以使用其建構函式建立，且所有建構函式參數都已在 DI 容器中註冊，則您可以使用建構函式參考。

```kotlin
dependencies {
    provide<GreetingService>(::GreetingServiceImpl)
}
```
這會告知您的應用程式使用 `GreetingServiceImpl` 的建構函式，並讓 DI 解析其參數。

#### 使用類別參考 {id="class-reference"}

您可以註冊一個具體類別而不將其繫結到介面：

```kotlin
dependencies {
    provide(BankServiceImpl::class)
}
```
在這種情況下，相依項會透過其 `BankServiceImpl` 型別進行解析。
當實作型別被直接注入且不需要抽象化時，這非常有用。

#### 使用 函式參考 {id="function-reference"}

您可以註冊一個用於建立並傳回執行個體的函式：

```kotlin
dependencies {
    provide(::createBankTeller)
}
```

DI 容器會解析函式參數，並將傳回值作為相依項執行個體。

#### 使用工廠 Lambda 運算式 {id="factory-lambda-registration"}

您可以將函式本身註冊為相依項：

```kotlin
dependencies {
    provide<() -> GreetingService> {
        { GreetingServiceImpl() }
    }
}
```

這會註冊一個可以被注入並手動呼叫以建立新執行個體的函式。

### 具名相依項註冊 {id="named-registration"}

您可以在註冊時為相依項指派名稱，以區分相同型別的多個提供者。

當您需要為單一型別註冊多個實作或執行個體，並在解析期間明確選擇其中之一時，這非常有用。

要為相依項指派名稱，請將名稱作為第一個引數傳遞給 `provide()` 函式：

```kotlin
dependencies {
    provide("default") { GreetingServiceImpl() }
    provide("alternative") { AlternativeGreetingServiceImpl() }
}
```

具名相依項必須[使用 `@Named` 註解明確解析](server-di-dependency-resolution.md#resolve-named)。

### 基於配置的相依項註冊

您可以在配置檔案中使用類別路徑參考來宣告式地配置相依項。您可以列出傳回物件的函式，或是具有可解析建構函式的類別。

在配置檔案中的 `ktor.application.dependencies` 群組下條列相依項：

<Tabs>
<TabItem title="application.yaml">

```yaml
ktor:
  application:
    dependencies:
      - com.example.RepositoriesKt.provideDatabase
      - com.example.UserRepository
```

</TabItem>
</Tabs>

Ktor 會使用 DI 容器自動解析函式與建構函式參數。