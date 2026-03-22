---
title: Android 库集成
---

本指南涵盖了将常见的 Android 库与 Koin 集成的内容。

:::info
有关核心定义类型和外部库绑定模式，请参阅 [Definitions](/docs/reference/koin-core/definitions)。本页重点介绍 Android 特有的库示例。
:::

## Retrofit

```kotlin
interface ApiService {
    @GET("users/{id}")
    suspend fun getUser(@Path("id") id: String): User
}

// 构建器函数 - Koin 会自动解析参数
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

或者使用注解：

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

## Room 数据库

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

或者使用注解：

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

## Gson / 序列化

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
对于 WorkManager 设置，请使用 `koin-androidx-workmanager` 依赖项。有关完整设置，请参阅 [WorkManager 集成](/docs/reference/koin-android/workmanager)。
:::

## Android 简洁架构

### 仓库模式 (Repository Pattern)

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

### 带 SavedStateHandle 的 ViewModel

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

## 后续步骤

- **[Definitions](/docs/reference/koin-core/definitions)** - 核心定义类型
- **[WorkManager](/docs/reference/koin-android/workmanager)** - 完整的 WorkManager 设置
- **[Android Scopes](/docs/reference/koin-android/scope)** - 生命周期作用域实例
- **[ViewModel](/docs/reference/koin-android/viewmodel)** - ViewModel 注入模式