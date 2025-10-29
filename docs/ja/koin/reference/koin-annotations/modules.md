---
title: アプリケーション、設定、およびモジュール
---

## @KoinApplication を用いたアプリケーションのブートストラップ

完全な Koin アプリケーションのブートストラップを作成するには、エントリーポイントクラスに `@KoinApplication` アノテーションを使用できます。このアノテーションは、Koin アプリケーションのブートストラップ関数を生成するのに役立ちます。

```kotlin
@KoinApplication // load default configuration
object MyApp

@KoinApplication(
    configurations = ["default", "production"], 
    modules = [MyModule::class]
)
object MyApp
```

これにより、Koin アプリケーションを起動するための**2つ**の関数が生成されます。

```kotlin
// The import below gives you access to generated extension functions
import org.koin.ksp.generated.*

fun main() {
    // Option 1: Start Koin directly
    MyApp.startKoin()
    
    // Option 2: Get KoinApplication instance
    val koinApp = MyApp.koinApplication()
}
```

生成された両方の関数は、カスタム設定をサポートしています。

```kotlin
fun main() {
    MyApp.startKoin {
        printLogger()
        // Add other Koin configuration
    }
    
    // Or with koinApplication
    MyApp.koinApplication {
        printLogger()
    }
}
```

`@KoinApplication` アノテーションは以下をサポートします：
- `configurations`: スキャンしてロードする設定名の配列
- `modules`: 直接含めるモジュールクラスの配列 (設定に加えて)

:::info
設定が指定されていない場合、「default」設定が自動的にロードされます。
:::

## @Configuration を用いた設定管理

`@Configuration` アノテーションを使用すると、モジュールを異なる設定 (環境、フレーバーなど) に整理できます。これは、デプロイ環境や機能セットごとにモジュールを整理するのに役立ちます。

### 基本的な設定の使用方法

```kotlin
// Put module in default Configuration
@Module
@Configuration
class CoreModule
```

:::info
デフォルト設定は「default」という名前で、`@Configuration` または `@Configuration("default")` とともに使用できます。
:::

設定からモジュールをスキャンできるようにするには、`@KoinApplication` を使用する必要があります。

```kotlin
// module A
@Module
@Configuration
class ModuleA

// module B
@Module
@Configuration
class ModuleB

// module App, scan all @Configuration modules
@KoinApplication
object MyApp
```

### 複数設定のサポート

モジュールは複数の設定に関連付けることができます。

```kotlin
// This module is available in both "prod" and "test" configurations
@Module
@Configuration("prod", "test")
class DatabaseModule {
    @Single
    fun database() = PostgreSQLDatabase()
}

// This module is available in default, test, and development
@Module
@Configuration("default", "test", "development") 
class LoggingModule {
    @Single
    fun logger() = Logger()
}
```

### 環境固有の設定

```kotlin
// Development-only configuration
@Module
@Configuration("development")
class DevDatabaseModule {
    @Single
    fun database() = InMemoryDatabase()
}

// Production-only configuration  
@Module
@Configuration("production")
class ProdDatabaseModule {
    @Single
    fun database() = PostgreSQLDatabase()
}

// Available in multiple environments
@Module
@Configuration("default", "production", "development")
class CoreModule {
    @Single
    fun logger() = Logger()
}
```

### @KoinApplication で設定を使用する

デフォルトでは、`@KoinApplication` はすべてのデフォルト設定 (`@Configuration` でタグ付けされたモジュール) をロードします。

アプリケーションのブートストラップでこれらの設定を参照することもできます。

```kotlin
@KoinApplication(configurations = ["default", "production"])
class ProductionApp

@KoinApplication(configurations = ["default", "development"])  
class DevelopmentApp

// Load only default configuration (same as @KoinApplication with no parameters)
@KoinApplication
class SimpleApp
```

:::info
- 空の `@Configuration` は `@Configuration("default")` と同等です。
- 特定の設定が指定されていない場合、「default」設定は自動的にロードされます。
- モジュールは、アノテーションにそれらをリストすることで、複数の設定に属することができます。
:::

## デフォルトモジュール (1.3.0 以降非推奨)

:::warning
デフォルトモジュールのアプローチは、Annotations 1.3.0 以降非推奨です。より良い整理と明確さのために、`@Module` および `@Configuration` アノテーションを用いた明示的なモジュールの使用をお勧めします。
:::

定義を利用する際、それらをモジュールに整理する必要がある場合とない場合があります。以前は、「default」生成モジュールを使用して、明示的なモジュールなしで定義をホストできました。

モジュールを指定したくない場合、Koinはすべての定義をホストするためのデフォルトのモジュールを提供します。`defaultModule` は直接使用できます。

```kotlin
// The import below gives you access to generated extension functions
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        defaultModule()
    }
}

// or 

fun main() {
    startKoin {
        modules(
          defaultModule
        )
    }
}
```

**推奨されるアプローチ**: デフォルトモジュールを使用する代わりに、定義を明示的なモジュールに整理します。

```kotlin
@Module
@Configuration
class MyModule {
    // Your definitions here
}

// Then use @KoinApplication
@KoinApplication
object MyApp
```

:::info
`org.koin.ksp.generated.*` のインポートを忘れないでください。
:::

## @Module を用いたクラスモジュール

モジュールを宣言するには、クラスに `@Module` アノテーションを付けるだけです。

```kotlin
@Module
class MyModule
```

Koinにモジュールをロードするには、任意の `@Module` クラス用に生成された `.module` 拡張機能を使用するだけです。モジュールの新しいインスタンス `MyModule().module` を作成するだけで済みます。

```kotlin
// Use Koin Generation
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          MyModule().module
        )
    }
}
```

> `org.koin.ksp.generated.*` のインポートを忘れないでください。

## @ComponentScan を用いたコンポーネントスキャン

アノテーション付きコンポーネントをスキャンしてモジュールにまとめるには、モジュールに `@ComponentScan` アノテーションを使用するだけです。

```kotlin
@Module
@ComponentScan
class MyModule
```

これにより、現在のパッケージとそのサブパッケージをスキャンし、アノテーション付きコンポーネントを探します。特定のパッケージ (`@ComponentScan("com.my.package")`) をスキャンするように指定することもできます。

:::info
`@ComponentScan` アノテーションを使用する場合、KSPは同じパッケージに対して全てのGradleモジュールを横断します。(1.4以降)
:::

## クラスモジュール内の定義

コード内で定義を直接定義するには、関数を定義アノテーションでアノテーション付けすることができます。

```kotlin
// given 
// class MyComponent(val myDependency : MyDependency)

@Module
class MyModule {

  @Single
  fun myComponent(myDependency : MyDependency) = MyComponent(myDependency)
}
```

> **注**: `@InjectedParam` (startKoin から注入されたパラメーター用) および `@Property` (プロパティ注入用) は、関数メンバーでも使用可能です。これらのアノテーションの詳細については、定義ドキュメントを参照してください。

## モジュールの組み込み

他のクラスモジュールを自分のモジュールに含めるには、`@Module` アノテーションの `includes` 属性を使用するだけです。

```kotlin
@Module
class ModuleA

@Module(includes = [ModuleA::class])
class ModuleB
```

このようにして、ルートモジュールを実行するだけで済みます。

```kotlin
// Use Koin Generation
import org.koin.ksp.generated.*

fun main() {
    startKoin {
        modules(
          // will load ModuleB & ModuleA
          ModuleB().module
        )
    }
}
```