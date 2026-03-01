[//]: # (title: 依存関係の登録)

<show-structure for="chapter" depth="2"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-server-di</code>
</p>
<var name="example_name" value="server-di"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

Ktorの[依存性の注入 (DI)](server-dependency-injection.md)コンテナは、アプリケーションが依存するオブジェクトを作成する方法を知る必要があります。このプロセスは「依存関係の登録」と呼ばれます。

### 基本的な依存関係の登録

基本的な依存関係の登録は、通常、`Application`モジュール内の`dependencies {}`ブロックを使用してコード内で行われます。

依存関係は、[ラムダ](#lambda-registration)、[関数参照](#function-reference)、[クラス参照](#class-reference)、または[コンストラクタ参照](#constructor-reference)を提供することで登録できます。

#### ラムダを使用する {id="lambda-registration"}

インスタンスの作成方法を完全に制御したい場合は、ラムダを使用します。

```kotlin
dependencies {
    provide<GreetingService> { GreetingServiceImpl() }
}
```
これは `GreetingService` のプロバイダーを登録します。`GreetingService` が要求されるたびに、ラムダが実行されてインスタンスが作成されます。

#### コンストラクタ参照を使用する {id="constructor-reference"}

クラスがコンストラクタを使用して作成でき、かつすべてのコンストラクタパラメータがすでにDIコンテナに登録されている場合は、コンストラクタ参照を使用できます。

```kotlin
dependencies {
    provide<GreetingService>(::GreetingServiceImpl)
}
```
これは、アプリケーションに `GreetingServiceImpl` のコンストラクタを使用するように指示し、パラメータの解決はDIに任せます。

#### クラス参照を使用する {id="class-reference"}

インターフェースにバインドせずに、具象クラスを登録できます。

```kotlin
dependencies {
    provide(BankServiceImpl::class)
}
```
この場合、依存関係は `BankServiceImpl` 型によって解決されます。
これは、実装型が直接注入され、抽象化が必要ない場合に便利です。

#### 関数参照を使用する {id="function-reference"}

インスタンスを作成して返す関数を登録できます。

```kotlin
dependencies {
    provide(::createBankTeller)
}
```

DIコンテナは関数のパラメータを解決し、戻り値を依存関係のインスタンスとして使用します。

#### ファクトリラムダを使用する {id="factory-lambda-registration"}

関数自体を依存関係として登録できます。

```kotlin
dependencies {
    provide<() -> GreetingService> {
        { GreetingServiceImpl() }
    }
}
```

これにより、手動で呼び出して新しいインスタンスを作成できる、注入可能な関数が登録されます。

### 名前付き依存関係の登録 {id="named-registration"}

登録時に依存関係に名前を割り当てることで、同じ型の複数のプロバイダーを区別できます。

これは、単一の型に対して複数の実装またはインスタンスを登録し、解決時にそれらを明示的に選択する必要がある場合に便利です。

依存関係に名前を割り当てるには、`provide()` 関数の最初の引数として名前を渡します。

```kotlin
dependencies {
    provide("default") { GreetingServiceImpl() }
    provide("alternative") { AlternativeGreetingServiceImpl() }
}
```

名前付き依存関係は、[`@Named`アノテーションを使用して明示的に解決](server-di-dependency-resolution.md#resolve-named)する必要があります。

### 設定ベースの依存関係の登録

設定ファイル内のクラスパス参照を使用して、宣言的に依存関係を設定できます。オブジェクトを返す関数、または解決可能なコンストラクタを持つクラスをリストできます。

設定ファイルの `ktor.application.dependencies` グループの下に依存関係をリストします。

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

KtorはDIコンテナを使用して、関数やコンストラクタのパラメータを自動的に解決します。