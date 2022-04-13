const { useRouter } = require('next/router')
const { useForm  } = require('react-hook-form')
const { yupResolver } = require('@hookform/resolvers/yup');
import { alertService } from "../service/Alert/Alert"
let yup = require('yup');

const userService = require('../service/User/User')

const Register = () => {
    const router = useRouter();

    let schema = yup.object().shape({
        nickname: yup.string()
        .required('Nickname is required')
        .min(4, 'Nickname must be at least 4 characters'),
        password: yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
      });
    
    const formOptions = { resolver: yupResolver(schema)}
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit(user) {
        return userService.register(user)
            .then((success) => {
                if (success[0]) {
                    alertService.success(success[1], {keepAfterRouteChange: true})
                    router.push('login');
                }

            })
            .catch((error) => console.warn(error));
    }

    return (
        <>
            <div className="bwm-form">
                <div className="row">
                    <div className="col-md-4 mx-auto">
                        <h1 className="page-title">Register</h1>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-group">
                                <label htmlFor="nickname">Nickname</label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.nickname ? 'is-invalid' : ''}`}
                                    name="nickname"
                                    {...register('nickname')}
                                    id="nickname" />
                                <div className="invalid-feedback">
                                    {errors.nickname?.message}
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                    name="password"
                                    {...register('password')}
                                    id="password" />
                                <div className="invalid-feedback">
                                    {errors.password?.message}
                                </div>
                            </div>
                            <h6>
                                <a href='/login' className="return-a">return to login?.</a>
                            </h6>
                            <button
                                type="submit"
                                disabled={formState.isSubmitting}
                                className="btn btn-main bg-blue py-2 ttu center-button">
                                    Register
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </> 
    )
}


export default Register;