---
title: Android ライブラリとの統合
---

このガイドでは、一般的な Android ライブラリと Koin を統合する方法について説明します。

:::info
コアの定義タイプや外部ライブラリのバインディングパターンについては、[定義](/docs/reference/koin-core/definitions)を参照してください。このページでは、Android 特有のライブラリの例に焦点を当てています。
:::

## Retrofit

```kotlin
interface ApiService {
    @GET("users/{id}")
    suspend fun getUser(@Path("id") id: String): User
}

// ビルダー関数 - Koin はパラメータを自動的に解決します
fun createOkHttpClient(): OkHttpClient =
    OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        })
        .build()

fun createRetrofit(client: OkHttpClient): Retrofit =
    Retrofit.Builder()
        .baseUrl("https://api.example.com/")
        .client(client)
        .addConverterFactory(GsonConverterFactory.create())
        .build()

fun createApiService(retrofit: Retrofit): ApiService =
    retrofit.create(ApiService::class.java)

val networkModule = module {
    single { create(::createOkHttpClient) }
    single { create(::createRetrofit) }
    single { create(::createApiService) }
}
```

またはアノテーションを使用する場合:

```kotlin
@Module
class NetworkModule {
    @Single
    fun provideOkHttpClient(): OkHttpClient =
        OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .build()

    @Single
    fun provideRetrofit(client: OkHttpClient): Retrofit =
        Retrofit.Builder()
            .baseUrl("https://api.example.com/")
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()

    @Single
    fun provideApiService(retrofit: Retrofit): ApiService =
        retrofit.create(ApiService::class.java)
}
```

## Room Database

```kotlin
@Database(entities = [User::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
}

fun createDatabase(context: Context): AppDatabase =
    Room.databaseBuilder(context, AppDatabase::class.java, "app-database").build()

fun createUserDao(database: AppDatabase): UserDao = database.userDao()

val databaseModule = module {
    single { create(::createDatabase) }
    single { create(::createUserDao) }
}
```

またはアノテーションを使用する場合:

```kotlin
@Module
class DatabaseModule {
    @Single
    fun provideDatabase(context: Context): AppDatabase =
        Room.databaseBuilder(context, AppDatabase::class.java, "app-database").build()

    @Single
    fun provideUserDao(database: AppDatabase): UserDao = database.userDao()
}
```

## Gson / Serialization

```kotlin
fun createGson(): Gson =
    GsonBuilder()
        .setDateFormat("yyyy-MM-dd'T'HH:mm:ss")
        .setPrettyPrinting()
        .create()

val serializationModule = module {
    single { create(::createGson) }
}
```

## WorkManager

```kotlin
class SyncWorker(
    context: Context,
    params: WorkerParameters,
    private val repository: SyncRepository
) : Worker(context, params) {

    override fun doWork(): Result {
        repository.sync()
        return Result.success()
    }
}

val workModule = module {
    workerOf(::SyncWorker)
}
```

:::note
WorkManager のセットアップには、`koin-androidx-workmanager` 依存関係を使用します。完全なセットアップについては、[WorkManager の統合](/docs/reference/koin-android/workmanager)を参照してください。
:::

## Android クリーンアーキテクチャ (Clean Architecture)

### リポジトリパターン (Repository Pattern)

```kotlin
@Singleton
class UserRemoteDataSource(private val api: ApiService)

@Singleton
class UserLocalDataSource(private val database: AppDatabase)

@Singleton
class UserRepositoryImpl(
    private val remoteDataSource: UserRemoteDataSource,
    private val localDataSource: UserLocalDataSource
) : UserRepository

// DSL
val dataModule = module {
    single<UserRemoteDataSource>()
    single<UserLocalDataSource>()
    single<UserRepositoryImpl>() bind UserRepository::class
}
```

### ユースケースパターン (Use Case Pattern)

```kotlin
@Factory
class GetUserUseCase(private val userRepository: UserRepository) {
    suspend operator fun invoke(userId: String): Result<User> = runCatching {
        userRepository.getUser(userId)
    }
}

val domainModule = module {
    factory<GetUserUseCase>()
}
```

### SavedStateHandle を使用した ViewModel

```kotlin
@KoinViewModel
class UserViewModel(
    private val getUserUseCase: GetUserUseCase,
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {

    private val userId: String = savedStateHandle["userId"] ?: ""

    fun loadUser() {
        viewModelScope.launch {
            getUserUseCase(userId)
        }
    }
}

val viewModelModule = module {
    viewModel<UserViewModel>()
}
```

## 次のステップ

- **[定義](/docs/reference/koin-core/definitions)** - コアの定義タイプ
- **[WorkManager](/docs/reference/koin-android/workmanager)** - WorkManager の完全なセットアップ
- **[Android スコープ](/docs/reference/koin-android/scope)** - ライフサイクルにスコープされたインスタンス
- **[ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModel のインジェクションパターン