---
title: Android 程式庫整合
---

這份指南涵蓋了將常見的 Android 程式庫與 Koin 整合的方法。

:::info
關於核心定義型別與外部程式庫繫結模式，請參閱 [Definitions](/docs/reference/koin-core/definitions)。本頁面側重於 Android 特定的程式庫範例。
:::

## Retrofit

```kotlin
interface ApiService {
    @GET("users/{id}")
    suspend fun getUser(@Path("id") id: String): User
}

// Builder 函式 — Koin 會自動解析參數
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

或者使用註解 (Annotation)：

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

## Room 資料庫

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

或者使用註解 (Annotation)：

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

## Gson / 序列化 (Serialization)

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
關於 WorkManager 設定，請使用 `koin-androidx-workmanager` 相依性。請參閱 [WorkManager 整合](/docs/reference/koin-android/workmanager) 以獲取完整的設定說明。
:::

## Android Clean Architecture

### Repository 模式

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

### Use Case 模式

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

### 配合 SavedStateHandle 的 ViewModel

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

## 後續步驟

- **[Definitions](/docs/reference/koin-core/definitions)** - 核心定義型別
- **[WorkManager](/docs/reference/koin-android/workmanager)** - 完整的 WorkManager 設定
- **[Android Scopes](/docs/reference/koin-android/scope)** - 生命週期作用域執行個體
- **[ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModel 注入模式